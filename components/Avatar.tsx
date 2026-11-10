import Image from "next/image";
import { resolveImageUrl } from "@/lib/api";

interface AvatarProps {
  src?: string;
  alt?: string;
}

const Avatar = ({ src, alt = "Krishna" }: AvatarProps) => {
  const imageSrc = resolveImageUrl(src || "/assets/krishna.png");

  return (
    <div className="flex w-full h-full pointer-events-none select-none justify-center items-end">
      <Image
        src={imageSrc}
        alt={alt}
        width={737}
        height={678}
        className="translate-z-0 w-full h-full object-contain lg:object-bottom"
        priority
        unoptimized
      />
    </div>
  );
};

export default Avatar;
