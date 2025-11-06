import { type RefObject } from "react";
import { Text } from "../atoms/text";

interface VideoPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
}

export function VideoPreview({ videoRef, isStreaming }: VideoPreviewProps) {
  return (
    <div className="relative w-full max-w-2xl bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto"
      />
      {!isStreaming && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <Text className="text-white">カメラを起動中...</Text>
        </div>
      )}
    </div>
  );
}
