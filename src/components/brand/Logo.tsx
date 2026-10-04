import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({
  variant = "light",
  className,
  width = 180,
  height = 60,
  priority = false
}: LogoProps) {
  const logoSrc = variant === "light"
    ? "/brand/logo-light-transparent.png"
    : "/brand/logo-dark-transparent.png";

  return (
    <Image
      src={logoSrc}
      alt="HSE BRIDGE - Health, Safety, Environment"
      width={width}
      height={height}
      priority={priority}
      style={{ width: 'auto', height: 'auto', maxWidth: width, maxHeight: height }}
      className={cn("object-contain", className)}
    />
  );
}
