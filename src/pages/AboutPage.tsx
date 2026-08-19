import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { AboutPortrait3D } from '../components/AboutPortrait3D';
import { GraduationCap, Code2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 max-w-6xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 xl:gap-14 items-center w-full"
      >
        {/* Left Column: About Content */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-pixel">
              Profile Overview
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
              About Me
            </h1>
            <p className="text-red-400 font-pixel text-base sm:text-lg mt-1.5">
              Full Stack Developer & Computer Engineering Student
            </p>
          </div>

          {/* Exact Verbatim Description */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/15 leading-relaxed text-sm sm:text-base text-neutral-200 backdrop-blur-md shadow-xl">
            I’m Krishna Prasad Bhandari, a Computer Engineering student and Full Stack Developer focused on building modern, scalable, and user-centered web applications. I enjoy working across frontend and backend technologies, transforming ideas into functional digital products, and continuously exploring new technologies in software development, APIs, databases, cybersecurity, IoT, and AI.
          </div>

          {/* Academic Focus & Core Passion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-neutral-400 mb-2">
                <GraduationCap size={16} className="text-red-400" />
                <span>Academic Focus</span>
              </div>
              <p className="text-sm text-white font-medium">
                BE Computer Engineering (4th Sem)
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Lumbini Engineering College, Pokhara University
              </p>
            </div>

            <div className="p-5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-neutral-400 mb-2">
                <Code2 size={16} className="text-red-400" />
                <span>Core Passion</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Building responsive web applications, robust backend architectures, and hardware-software IoT integrations.
              </p>
            </div>
          </div>

          {/* Direct Route Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/education"
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>View Education</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/projects"
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>View Projects</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Get in Touch</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Animated 12.jpeg Portrait */}
        <div className="w-full flex items-center justify-center lg:justify-end">
          <AboutPortrait3D />
        </div>
      </motion.div>
    </div>
  );
};
