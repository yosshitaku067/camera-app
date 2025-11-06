export type CaptureState =
  | { step: "capture1" }
  | { step: "preview1"; image1: string }
  | { step: "capture2"; image1: string }
  | { step: "preview2"; image1: string; image2: string };

export interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onError?: (error: string) => void;
}

export interface ImagePreviewProps {
  imageData: string;
  imageNumber: number;
  onRetake: () => void;
  onConfirm: () => void;
}
