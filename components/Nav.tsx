"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  HiHome,
  HiUser,
  HiViewColumns,
  HiRectangleGroup,
  HiEnvelope,
} from "react-icons/hi2";
import { HiCode, HiAcademicCap } from "react-icons/hi";

export const navData: { name: string; path: string; Icon: IconType }[] = [
  { name: "home", path: "/", Icon: HiHome },
  { name: "about", path: "/about", Icon: HiUser },
  { name: "skills", path: "/skills", Icon: HiCode },
  { name: "education", path: "/education", Icon: HiAcademicCap },
  { name: "services", path: "/services", Icon: HiRectangleGroup },
  { name: "work", path: "/work", Icon: HiViewColumns },
  {
    name: "contact",
    path: "/contact",
    Icon: HiEnvelope,
  },
];

const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 inset-x-0 mx-auto w-[92%] max-w-[420px] h-[58px] z-50 lg:inset-x-auto lg:mx-0 lg:right-6 xl:right-10 lg:top-1/2 lg:-translate-y-1/2 lg:w-16 lg:h-max lg:bottom-auto">
      <div className="flex w-full items-center justify-between px-6 lg:px-0 h-full lg:h-auto py-2 lg:py-8 bg-black/60 lg:bg-white/10 backdrop-blur-md border border-white/10 rounded-full lg:flex-col lg:justify-center lg:gap-y-10 text-2xl lg:text-xl">
        {navData.map((link, i) => (
          <Link
            prefetch
            className={`${
              link.path === pathname && "text-accent"
            } relative flex items-center group hover:text-accent transition-all duration-300`}
            href={link.path}
            key={i}
          >
            <div
              role="tooltip"
              className="absolute pr-14 right-0 hidden lg:group-hover:flex"
            >
              <div className="bg-white relative flex text-primary items-center p-1.5 rounded-[3px]">
                <div className="text-[12px] leading-none font-semibold capitalize">
                  {link.name}
                </div>

                <div
                  className="border-solid border-l-white border-l-8 border-y-transparent border-y-[6px] border-r-0 absolute -right-2"
                  aria-hidden
                />
              </div>
            </div>

            <div className="relative flex items-center">
              {link.path === pathname && (
                <div className="absolute -left-4 lg:-left-5 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-accent rounded-full shadow-[0_0_8px_rgba(255,0,0,0.6)]"></div>
              )}
              <link.Icon aria-hidden />
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Nav;
