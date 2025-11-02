import { ImageSetCard } from "./ImageSetCard";

interface ImageSet {
  timestamp: number;
  datetime: string;
  images: Array<{ filename: string; url: string }>;
}

interface ImageHistoryProps {
  imageSets: ImageSet[];
  isDeleting?: boolean;
}

export function ImageHistory({
  imageSets,
  isDeleting = false,
}: ImageHistoryProps) {
  if (imageSets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">まだ撮影した画像がありません</p>
        <p className="text-gray-400 text-sm mt-2">
          カメラを起動して写真を撮影しましょう
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">撮影履歴</h2>
      <div className="space-y-4">
        {imageSets.map((imageSet) => (
          <ImageSetCard
            key={imageSet.timestamp}
            timestamp={imageSet.timestamp}
            datetime={imageSet.datetime}
            images={imageSet.images}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    </div>
  );
}
