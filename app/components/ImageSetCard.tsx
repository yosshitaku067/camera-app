import { Form } from "react-router";
import { useState } from "react";

interface ImageSetCardProps {
  timestamp: number;
  datetime: string;
  images: Array<{ filename: string; url: string }>;
  isDeleting?: boolean;
}

export function ImageSetCard({
  timestamp,
  datetime,
  images,
  isDeleting = false,
}: ImageSetCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">撮影日時:</span> {datetime}
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          削除
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {images.map((image, index) => (
          <div key={image.filename} className="relative">
            <img
              src={image.url}
              alt={`撮影画像 ${index + 1}`}
              className="w-full h-auto rounded border border-gray-200"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              {index + 1}枚目
            </div>
          </div>
        ))}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-2">削除の確認</h3>
            <p className="text-gray-600 mb-4">
              この2枚の画像を削除しますか？この操作は取り消せません。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                キャンセル
              </button>
              <Form method="post">
                <input type="hidden" name="action" value="delete" />
                <input type="hidden" name="timestamp" value={timestamp} />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  削除する
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
