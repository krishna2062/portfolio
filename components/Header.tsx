"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Socials from "@/components/Socials";
import { api, resolveImageUrl } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState<string>("/assets/logo.png");
  const [brandTitle, setBrandTitle] = useState<string>("Krishna");

  useEffect(() => {
    api.getProfile().then((p) => {
      if (p) {
        if (p.logoUrl) setLogoUrl(p.logoUrl);
        if (p.brandTitle) setBrandTitle(p.brandTitle);
      }
    });
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const resolvedLogo = resolveImageUrl(logoUrl);

  return (
    <header className="absolute z-40 w-full px-4 sm:px-8 lg:px-16 py-4 sm:py-6 flex items-center">
      <div className="container mx-auto max-w-7xl">
        {/* Strict single-row split layout across all viewports */}
        <div className="flex flex-row items-center justify-between gap-x-4 w-full">
          
          {/* LEFT: Brand Logo & Name */}
          <Link className="flex items-center gap-2.5 sm:gap-3 select-none flex-shrink-0 group" href="/" prefetch>
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <img
                alt={`${brandTitle} Logo`}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                src={resolvedLogo}
              />
            </div>
            <span className="text-lg sm:text-2xl font-black tracking-tight text-white group-hover:text-white/90 transition-colors duration-300">
              {brandTitle}
              <span className="text-[#f13024]">.</span>
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

