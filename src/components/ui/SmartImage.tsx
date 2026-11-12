import Image, { type ImageProps } from "next/image";
import { imageMeta } from "@/data/image-meta";

type Props = Omit<ImageProps, "src" | "width" | "height" | "placeholder" | "blurDataURL"> & {
  src: string;
};

/** next/image with intrinsic size and a dominant-colour placeholder filled in. */
export function SmartImage({ src, fill, alt, style, ...rest }: Props) {
  const [width = 1000, height = 1250, color] = imageMeta[src] ?? [];
  const merged = color ? { backgroundColor: color, ...style } : style;
  if (fill) return <Image src={src} alt={alt} fill style={merged} {...rest} />;
  return <Image src={src} alt={alt} width={width} height={height} style={merged} {...rest} />;
}
