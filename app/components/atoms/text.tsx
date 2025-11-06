import type { ReactNode } from "react";

interface TextProps {
  className?: string;
  children: ReactNode;
}

export function Text({ className = "", children }: TextProps) {
  return <p className={className}>{children}</p>;
}
