import { useState } from "react";
import { Form, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/camera";
import { CameraCapture } from "../components/CameraCapture";
import { ImagePreview } from "../components/ImagePreview";
import { saveBase64Image } from "../utils/storage";

type CaptureState =
  | { step: "capture1" }
  | { step: "preview1"; image1: string }
  | { step: "capture2"; image1: string }
  | { step: "preview2"; image1: string; image2: string };

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const image1Data = formData.get("image1") as string;
  const image2Data = formData.get("image2") as string;

  if (!image1Data || !image2Data) {
    throw new Error("画像データが不足しています");
  }

  // Generate timestamp for unique filenames
  const timestamp = Date.now();

  // Save images using storage utility
  await Promise.all([
    saveBase64Image(image1Data, `image_${timestamp}_1.jpg`),
    saveBase64Image(image2Data, `image_${timestamp}_2.jpg`),
  ]);

  console.log(`Images saved: image_${timestamp}_1.jpg, image_${timestamp}_2.jpg`);

  return redirect("/?success=true");
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "カメラ撮影" },
    { name: "description", content: "2枚の写真を撮影します" },
  ];
}

export default function Camera() {
  const [state, setState] = useState<CaptureState>({ step: "capture1" });
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const handleCapture1 = (imageData: string) => {
    setState({ step: "preview1", image1: imageData });
  };

  const handleConfirm1 = () => {
    if (state.step === "preview1") {
      setState({ step: "capture2", image1: state.image1 });
    }
  };

  const handleRetake1 = () => {
    setState({ step: "capture1" });
  };

  const handleCapture2 = (imageData: string) => {
    if (state.step === "capture2") {
      setState({ step: "preview2", image1: state.image1, image2: imageData });
    }
  };

  const handleConfirm2 = () => {
    // Form submission will be handled by the form element
  };

  const handleRetake2 = () => {
    if (state.step === "preview2") {
      setState({ step: "capture2", image1: state.image1 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          カメラ撮影
        </h1>

        {state.step === "capture1" && (
          <div>
            <p className="text-center text-lg text-gray-700 mb-6">
              1枚目の写真を撮影してください
            </p>
            <CameraCapture onCapture={handleCapture1} />
          </div>
        )}

        {state.step === "preview1" && (
          <ImagePreview
            imageData={state.image1}
            imageNumber={1}
            onRetake={handleRetake1}
            onConfirm={handleConfirm1}
          />
        )}

        {state.step === "capture2" && (
          <div>
            <p className="text-center text-lg text-gray-700 mb-6">
              2枚目の写真を撮影してください
            </p>
            <CameraCapture onCapture={handleCapture2} />
          </div>
        )}

        {state.step === "preview2" && (
          <div>
            <ImagePreview
              imageData={state.image2}
              imageNumber={2}
              onRetake={handleRetake2}
              onConfirm={handleConfirm2}
            />

            <Form method="post" className="mt-6">
              <input type="hidden" name="image1" value={state.image1} />
              <input type="hidden" name="image2" value={state.image2} />
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  {isSubmitting ? "保存中..." : "2枚の写真を保存"}
                </button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
