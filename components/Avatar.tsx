import Image from "next/image";

const Avatar = () => {
  return (
    <div className="flex w-full h-full pointer-events-none select-none justify-center items-end">
      <Image
        src="/assets/krishna.png"
        alt="Krishna"
        width={737}
        height={678}
        className="translate-z-0 w-full h-full object-contain lg:object-bottom"
        priority
      />
    </div>
  );
};

export default Avatar;
