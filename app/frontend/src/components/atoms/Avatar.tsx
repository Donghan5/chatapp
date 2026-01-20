import React from "react";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
  xl: "w-24 h-24 text-xl",
};

export const Avatar = ({
  src,
  alt = "avatar",
  name = "?",
  size = "md",
  className = "",
}: AvatarProps) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClass = sizeStyles[size] || sizeStyles.md;

  // Case 1: If src is provided and image loads successfully
  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setImageError(true)}
        className={`rounded-full object-cover border border-gray-200 ${sizeClass} ${className}`}
      />
    );
  }

  // Case 2: Fallback to initials
  return (
    <div
      className={`
        flex items-center justify-center rounded-full bg-gray-200 text-gray-600 border border-gray-200
        ${sizeClass} ${className}
        `}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};
