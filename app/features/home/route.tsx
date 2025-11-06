import type { Route } from "../../routes/+types/home";
import { Link, useSearchParams, useNavigation } from "react-router";
import { readdir, unlink } from "fs/promises";
import { join } from "path";
import { ImageHistory } from "../../components/organisms/image-history";
import { Heading } from "../../components/atoms/heading";
import { Text } from "../../components/atoms/text";
import { Button } from "../../components/atoms/button";
import type { ImageSet } from "./types";

export async function loader({}: Route.LoaderArgs) {
  const uploadsDir = join(process.cwd(), "public", "uploads");

  try {
    const files = await readdir(uploadsDir);

    // Filter only JPEG image files with our naming pattern
    const imageFiles = files.filter((file) =>
      /^image_\d+_[12]\.jpg$/.test(file)
    );

    // Group images by timestamp
    const imageSetsMap = new Map<number, ImageSet>();

    imageFiles.forEach((filename) => {
      const match = filename.match(/^image_(\d+)_([12])\.jpg$/);
      if (!match) return;

      const timestamp = parseInt(match[1], 10);
      const imageNumber = parseInt(match[2], 10);

      if (!imageSetsMap.has(timestamp)) {
        imageSetsMap.set(timestamp, {
          timestamp,
          datetime: new Date(timestamp).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          images: [],
        });
      }

      const imageSet = imageSetsMap.get(timestamp)!;
      imageSet.images.push({
        filename,
        url: `/uploads/${filename}`,
      });
    });

    // Convert to array and sort by timestamp (newest first)
    const imageSets = Array.from(imageSetsMap.values())
      .filter((set) => set.images.length === 2) // Only include complete sets
      .sort((a, b) => b.timestamp - a.timestamp);

    return { imageSets };
  } catch (error) {
    console.error("Failed to read uploads directory:", error);
    return { imageSets: [] };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "delete") {
    const timestamp = formData.get("timestamp") as string;

    if (!timestamp) {
      throw new Error("Timestamp is required");
    }

    const uploadsDir = join(process.cwd(), "public", "uploads");

    try {
      // Delete both images
      await Promise.all([
        unlink(join(uploadsDir, `image_${timestamp}_1.jpg`)),
        unlink(join(uploadsDir, `image_${timestamp}_2.jpg`)),
      ]);

      return { success: true, message: "削除しました" };
    } catch (error) {
      console.error("Failed to delete images:", error);
      throw new Error("画像の削除に失敗しました");
    }
  }

  return { success: false };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "カメラアプリ" },
    { name: "description", content: "2枚の写真を撮影して保存します" },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const success = searchParams.get("success");
  const isDeleting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Heading level="h1" className="text-gray-900 mb-4">
            カメラアプリ
          </Heading>
          <Text className="text-xl text-gray-600 mb-8">
            2枚の写真を撮影して保存できます
          </Text>

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg inline-block">
              写真が正常に保存されました！
            </div>
          )}

          <Link to="/camera">
            <Button
              variant="primary"
              size="lg"
              className="rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              カメラを起動
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          <ImageHistory
            imageSets={loaderData.imageSets}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </div>
  );
}
