import { Button } from "../atoms/button";
import { Heading } from "../atoms/heading";
import { ImagePreviewFrame } from "../molecules/image-preview-frame";
import { ButtonGroup } from "../molecules/button-group";

interface ImagePreviewWithControlsProps {
  imageData: string;
  imageNumber: number;
  onRetake: () => void;
  onConfirm: () => void;
}

export function ImagePreviewWithControls({
  imageData,
  imageNumber,
  onRetake,
  onConfirm,
}: ImagePreviewWithControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Heading level="h2" className="text-gray-800">
        {imageNumber}枚目のプレビュー
      </Heading>

      <ImagePreviewFrame
        src={imageData}
        alt={`撮影画像 ${imageNumber}`}
      />

      <ButtonGroup>
        <Button variant="secondary" size="md" onClick={onRetake}>
          再撮影
        </Button>
        <Button variant="success" size="md" onClick={onConfirm}>
          OK
        </Button>
      </ButtonGroup>
    </div>
  );
}
