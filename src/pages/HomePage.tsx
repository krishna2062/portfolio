import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-between pt-2 pb-2">
      {/* 1. FOUR-COLUMN META GRID */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
      >
        {/* COL 1 (left) */}
        <div>
          <h2 className="text-lg md:text-xl tracking-wide leading-tight font-normal">
            <div>KRISHNA</div>
            <div className="font-pixel text-2xl md:text-3xl">BHANDARI</div>
          </h2>
          <div className="text-[10px] text-white/50 mt-3">*</div>
          <p className="font-pixel mt-1 text-xs text-white/60 leading-relaxed whitespace-pre-line">
            {`Computer Engineering student\nat Lumbini Eng. College (PU)\nbuilding modern web apps &\nscalable backend systems`}
          </p>
        </div>

        {/* COL 2 (text-right on mobile 2-col, text-left on lg) */}
        <div className="text-right lg:text-left">
          <h2 className="text-lg md:text-xl tracking-wide leading-tight font-normal">
            <div>FULL STACK</div>
            <div className="font-pixel text-2xl md:text-3xl">DEVELOPER</div>
          </h2>
        </div>

        {/* COL 3 */}
        <div>
          <div className="text-base tracking-widest text-white/50 uppercase mb-3 font-pixel">
            What I Do
          </div>
          <p className="text-sm text-white/90 leading-relaxed max-w-[220px]">
            I build modern, scalable, and user-centered web applications, APIs, and digital systems.
          </p>
        </div>

        {/* COL 4 (text-right on mobile 2-col, text-left on lg) */}
        <div className="text-right lg:text-left">
          <div className="text-base tracking-widest text-white/50 uppercase mb-3 font-pixel">
            Services
          </div>
          <ul className="text-sm text-white/90 leading-relaxed space-y-0.5">
            <li>Full Stack Web Development</li>
            <li>Frontend (React.js / Next.js)</li>
            <li>Backend (C# / ASP.NET Core)</li>
            <li>RESTful APIs & Web APIs</li>
            <li>Database Systems (SQL / Mongo)</li>
            <li>IoT & Real-Time Telemetry</li>
          </ul>
        </div>
      </motion.div>

      {/* 2. FLEX SPACER */}
      <div className="min-h-[60px] sm:min-h-[100px] flex-1" />

      {/* 3. BOTTOM HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="pb-2"
      >
        {/* ROW A */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-end">
          {/* LEFT — Hero headline */}
          <div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] tracking-wide uppercase font-normal"
              style={{ lineHeight: 0.76 }}
            >
              <div>I BUILD</div>
              <div>
                <span className="font-pixel font-normal text-[1.25em] inline-block leading-none align-baseline">
                  SCALABLE
                </span>{' '}
                &
              </div>
              <div>MODERN DIGITAL</div>
              <div>
                <span className="font-pixel font-normal text-[1.25em] inline-block leading-none align-baseline">
                  EXPERIENCES
                </span>
              </div>
            </h1>
          </div>

          {/* RIGHT — column */}
          <div className="flex flex-col gap-4 sm:gap-6 justify-end">
            {/* A) EXPLORE PROJECTS button (self-start) */}
            <Link
              to="/projects"
              className="self-start flex items-center gap-3 border border-white/30 px-6 py-3 backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all cursor-pointer"
            >
              <Play size={14} fill="white" className="text-white" />
              <span className="text-sm tracking-wider">EXPLORE PROJECTS</span>
            </Link>

            {/* B) Academic & Project Chips (self-start on mobile, lg:self-end) */}
            <div className="self-start lg:self-end flex flex-wrap items-stretch gap-2 sm:gap-3 text-sm text-white/80">
              <Link
                to="/education"
                className="bg-black/60 border border-white/10 px-3 sm:px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-colors rounded-sm"
              >
                <span className="font-bold text-sm sm:text-base tracking-tight">LEC / PU</span>
                <span className="text-white/50 text-xs">4th Sem</span>
              </Link>
              <Link
                to="/projects"
                className="bg-black/60 border border-white/10 px-3 sm:px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-colors rounded-sm"
              >
                <span className="font-bold text-lg sm:text-xl">Projects</span>
                <span className="text-white/50 text-xs">7+ Active</span>
              </Link>
              <Link
                to="/skills"
                className="bg-black/60 border border-white/10 px-3 sm:px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-colors rounded-sm"
              >
                <span className="font-bold text-[10px] sm:text-xs tracking-tight">
                  React / C#
                </span>
                <span className="text-white/50 text-xs">Full Stack</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ROW B — footer strip */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/70">
            Open to internships, freelance & full-stack roles.{' '}
            <Link
              to="/contact"
              className="text-red-400 hover:text-red-300 transition-colors underline cursor-pointer"
            >
              Schedule a call / Contact
            </Link>
          </div>
          <div className="text-xs text-white/60 sm:text-right">
            SkillNepal • Hamro Kirana • IoT Dashboards • Face Attendance
          </div>
        </div>
      </motion.div>
    </div>
  );
};
