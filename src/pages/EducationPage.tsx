import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EDUCATION_DATA } from '../data/portfolioData';

export const EducationPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 max-w-5xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 sm:mb-10"
      >
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-pixel">
          Academic Journey
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
          Education & Qualifications
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base mt-2 max-w-2xl">
          Formal engineering education and technical schooling background in Computer and Information Technology Engineering.
        </p>
      </motion.div>

      {/* Modern Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l border-white/20 space-y-8 sm:space-y-10 my-4">
        {EDUCATION_DATA.map((item, idx) => (
          <motion.div
            key={item.degree}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative group"
          >
            {/* Timeline Node Icon */}
            <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-neutral-900 border-2 border-red-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              {idx === 0 ? <GraduationCap size={14} className="text-red-400" /> : <Award size={13} className="text-red-400" />}
            </div>

            {/* Content Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md shadow-xl hover:border-white/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-pixel uppercase tracking-widest text-red-400">
                      {item.field}
                    </span>
                    {item.currentSemester && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
                        {item.currentSemester} (Enrolled)
                      </span>
                    )}
                    {item.gpa && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        GPA {item.gpa}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {item.degree}
                  </h3>
                </div>

                <div className="text-xs font-pixel text-neutral-400 sm:text-right">
                  <div>{item.period}</div>
                  <div className="text-white/80 font-medium">{item.status}</div>
                </div>
              </div>

              {/* Institution Details */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-200">
                <span className="font-semibold text-white">{item.institution}</span>
                {item.university && (
                  <>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-300">{item.university}</span>
                  </>
                )}
              </div>

              <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {item.details}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Engineering Core Modules Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="p-5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white font-pixel text-sm mb-2">
            <BookOpen size={16} className="text-red-400" />
            <span>Computer Science Core</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Data Structures & Algorithms, OOP, Database Systems, Computer Networks, and OS.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white font-pixel text-sm mb-2">
            <CheckCircle2 size={16} className="text-red-400" />
            <span>Hardware & Interfacing</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Microprocessors, Embedded Systems, IoT Controllers, and Real-Time Telemetry.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white font-pixel text-sm mb-2">
            <Award size={16} className="text-red-400" />
            <span>Software Development</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Full-Stack Web Architecture, API Engineering, System Design, and UI Implementation.
          </p>
        </div>
      </motion.div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/10">
        <Link
          to="/about"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to About
        </Link>
        <Link
          to="/skills"
          className="text-xs font-semibold text-white hover:text-red-400 flex items-center gap-1.5 transition-colors"
        >
          <span>Explore Technical Skills</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
