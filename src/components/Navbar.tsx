import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'ABOUT', path: '/about' },
  { label: 'EDUCATION', path: '/education' },
  { label: 'SKILLS', path: '/skills' },
  { label: 'PROJECTS', path: '/projects' },
  { label: 'EXPERIENCE', path: '/experience' },
  { label: 'SERVICES', path: '/services' },
  { label: 'BLOG', path: '/blog' },
  { label: 'CONTACT', path: '/contact' },
  { label: 'RESUME', path: '/resume' },
];

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="flex items-center justify-between py-5 sm:py-6 px-5 sm:px-6 md:px-10 lg:px-14 relative z-30">
        {/* Logo SVG */}
        <Link
          to="/"
          className="flex items-center hover:opacity-80 transition-opacity cursor-pointer group"
          aria-label="Krishna Prasad Bhandari Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 256 256"
            fill="none"
            className="w-7 h-7 transform group-hover:scale-105 transition-transform"
          >
            <path
              d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z"
              fill="white"
            />
          </svg>
        </Link>

        {/* Desktop Nav Links (lg+) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs xl:text-sm tracking-widest font-normal">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`transition-all duration-200 uppercase relative py-1 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-red-500 rounded-full animate-fadeIn" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Tablet Quick Nav (md to lg) */}
        <div className="hidden md:flex lg:hidden items-center gap-4 text-xs tracking-wider">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `uppercase ${isActive ? 'text-white font-bold' : 'text-white/70 hover:text-white'}`
            }
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/education"
            className={({ isActive }) =>
              `uppercase ${isActive ? 'text-white font-bold' : 'text-white/70 hover:text-white'}`
            }
          >
            EDUCATION
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `uppercase ${isActive ? 'text-white font-bold' : 'text-white/70 hover:text-white'}`
            }
          >
            PROJECTS
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `uppercase ${isActive ? 'text-white font-bold' : 'text-white/70 hover:text-white'}`
            }
          >
            CONTACT
          </NavLink>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-1.5 hover:opacity-70 transition-opacity text-white cursor-pointer ml-2"
            aria-label="Open full menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Hamburger (<md) */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 hover:opacity-70 transition-opacity text-white cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      <div
        className={`fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="Krishna Prasad Bhandari Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 256 256"
              fill="none"
              className="w-7 h-7"
            >
              <path
                d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z"
                fill="white"
              />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:opacity-70 transition-opacity text-white cursor-pointer"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Menu Links with Staggered Entrance */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-6 overflow-y-auto py-6">
          {NAV_ITEMS.map((item, i) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`text-xl sm:text-2xl tracking-widest transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? 'text-red-400 font-bold scale-105'
                    : 'text-white/80 hover:text-white'
                } ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{
                  transitionDelay: mobileOpen ? `${60 + i * 40}ms` : '0ms',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};
