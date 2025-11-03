import { useEffect, useRef, useState } from "react";
import { Button } from "../atoms/button";
import { ErrorAlert } from "../atoms/error-alert";
import { VideoPreview } from "../molecules/video-preview";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onError?: (error: string) => void;
}

export function CameraCapture({ onCapture, onError }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      const errorMessage =
        "カメラへのアクセスに失敗しました。カメラの使用を許可してください。";
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to JPEG format with 0.9 quality
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    onCapture(imageData);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error ? (
        <ErrorAlert message={error} />
      ) : (
        <>
          <VideoPreview videoRef={videoRef} isStreaming={isStreaming} />
          <Button
            variant="primary"
            size="lg"
            onClick={captureImage}
            disabled={!isStreaming}
            className="rounded-full"
          >
            撮影する
          </Button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
