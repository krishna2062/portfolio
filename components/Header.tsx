import Image from "next/image";
import Link from "next/link";

import Socials from "@/components/Socials";

export default function Header() {
  return (
    <header className="absolute z-40 w-full px-4 sm:px-8 lg:px-16 py-4 sm:py-6 flex items-center">
      <div className="container mx-auto max-w-7xl">
        {/* Strict single-row split layout across all viewports */}
        <div className="flex flex-row items-center justify-between gap-x-4 w-full">
          
          {/* LEFT: Brand Logo & Name */}
          <Link className="flex items-center gap-2.5 sm:gap-3 select-none flex-shrink-0 group" href="/" prefetch>
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image alt="Krishna Logo" className="object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md" fill priority sizes="(max-width: 768px) 32px, 40px" src="/assets/logo.png"/>
            </div>
            <span className="text-lg sm:text-2xl font-black tracking-tight text-white group-hover:text-white/90 transition-colors duration-300">
              Krishna<span className="text-[#f13024]">.</span>
            </span>
          </Link>

          {/* RIGHT: Social Media Icons */}
          <div className="flex-shrink-0">
            <Socials/>
          </div>

        </div>
      </div>
    </header>
  );
}

