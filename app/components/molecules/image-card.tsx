interface ImageCardProps {
  src: string;
  alt: string;
  label?: string;
}

export function ImageCard({ src, alt, label }: ImageCardProps) {
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto rounded border border-gray-200"
        loading="lazy"
      />
      {label && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {label}
        </div>
      )}
    </div>
  );
}
