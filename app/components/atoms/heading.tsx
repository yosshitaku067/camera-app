import type { ReactNode } from "react";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps {
  level: HeadingLevel;
  className?: string;
  children: ReactNode;
}

const headingClasses: Record<HeadingLevel, string> = {
  h1: "text-5xl font-bold",
  h2: "text-3xl font-bold",
  h3: "text-2xl font-bold",
  h4: "text-xl font-bold",
  h5: "text-lg font-bold",
  h6: "text-base font-bold",
};

export function Heading({ level, className = "", children }: HeadingProps) {
  const Component = level;
  return (
    <Component className={`${headingClasses[level]} ${className}`}>
      {children}
    </Component>
  );
}
