import { Form } from "react-router";
import { useState } from "react";
import { Button } from "../atoms/button";
import { Text } from "../atoms/text";
import { ImageCard } from "./image-card";
import { ConfirmDialog } from "./confirm-dialog";

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
        <Text className="text-sm text-gray-600">
          <span className="font-medium">撮影日時:</span> {datetime}
        </Text>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
        >
          削除
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {images.map((image, index) => (
          <ImageCard
            key={image.filename}
            src={image.url}
            alt={`撮影画像 ${index + 1}`}
            label={`${index + 1}枚目`}
          />
        ))}
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="削除の確認"
          message="この2枚の画像を削除しますか？この操作は取り消せません。"
          onCancel={() => setShowConfirm(false)}
          confirmButton={
            <Form method="post">
              <input type="hidden" name="action" value="delete" />
              <input type="hidden" name="timestamp" value={timestamp} />
              <Button variant="danger" size="md" type="submit">
                削除する
              </Button>
            </Form>
          }
        />
      )}
    </div>
  );
}
