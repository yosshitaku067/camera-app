import type { ReactNode } from "react";
import { Button } from "../atoms/button";
import { Heading } from "../atoms/heading";
import { Text } from "../atoms/text";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onCancel: () => void;
  confirmButton: ReactNode;
}

export function ConfirmDialog({
  title,
  message,
  onCancel,
  confirmButton,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <Heading level="h3" className="mb-2">
          {title}
        </Heading>
        <Text className="text-gray-600 mb-4">{message}</Text>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" size="md" onClick={onCancel}>
            キャンセル
          </Button>
          {confirmButton}
        </div>
      </div>
    </div>
  );
}
