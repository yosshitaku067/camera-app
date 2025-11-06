interface ImagePreviewFrameProps {
  src: string;
  alt: string;
}

export function ImagePreviewFrame({ src, alt }: ImagePreviewFrameProps) {
  return (
    <div className="w-full max-w-2xl bg-black rounded-lg overflow-hidden shadow-lg">
      <img src={src} alt={alt} className="w-full h-auto" />
    </div>
  );
}
