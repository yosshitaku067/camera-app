import type { ImagePreviewProps } from "../types";

export function ImagePreview({
  imageData,
  imageNumber,
  onRetake,
  onConfirm,
}: ImagePreviewProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-gray-800">
        {imageNumber}枚目のプレビュー
      </h2>

      <div className="w-full max-w-2xl bg-black rounded-lg overflow-hidden shadow-lg">
        <img
          src={imageData}
          alt={`撮影画像 ${imageNumber}`}
          className="w-full h-auto"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRetake}
          className="px-6 py-3 bg-gray-500 text-white text-lg font-semibold rounded-lg hover:bg-gray-600 transition-colors shadow-md"
        >
          再撮影
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
        >
          OK
        </button>
      </div>
    </div>
  );
}
