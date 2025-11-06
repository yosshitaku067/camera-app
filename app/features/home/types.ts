export interface ImageSet {
  timestamp: number;
  datetime: string;
  images: Array<{ filename: string; url: string }>;
}

export interface ImageHistoryProps {
  imageSets: ImageSet[];
  isDeleting?: boolean;
}

export interface ImageSetCardProps {
  timestamp: number;
  datetime: string;
  images: Array<{ filename: string; url: string }>;
  isDeleting?: boolean;
}
