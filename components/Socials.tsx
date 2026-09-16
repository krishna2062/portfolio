import Link from "next/link";
import type { IconType } from "react-icons";
import {
  RiGithubLine,
  RiLinkedinLine,
  RiGlobalLine,
  RiMailLine,
} from "react-icons/ri";

export const socialData: { name: string; link: string; Icon: IconType }[] = [
  {
    name: "Github",
    link: "https://github.com/krishna2062",
    Icon: RiGithubLine,
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/krishna-bhandari-8b0273333",
    Icon: RiLinkedinLine,
  },
  {
    name: "Website",
    link: "https://www.krishnabhandari01.com.np",
    Icon: RiGlobalLine,
  },
  {
    name: "Contact",
    link: "mailto:contact@krishnabhandari01.com.np",
    Icon: RiMailLine,
  },
];

const Socials = () => {
  return (
    <div className="flex items-center gap-x-5 text-lg">
      {socialData.map((social, i) => (
        <Link
          key={i}
          title={social.name}
          aria-label={social.name}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#f13024] hover:scale-110 transition-all duration-300 text-white/80"
        >
          <social.Icon aria-hidden />
        </Link>
      ))}
    </div>
  );
};

export default Socials;
