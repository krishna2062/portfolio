import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, ArrowRight, CheckCircle2, ShieldCheck, Terminal, Cpu, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EXPERIENCE_DATA } from '../data/portfolioData';

export const ExperiencePage: React.FC = () => {
  const currentExp = EXPERIENCE_DATA[0];

  return (
    <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 max-w-5xl mx-auto w-full">
      {/* Editorial Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-pixel">
          Work History & Roles
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
          Professional Experience
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base mt-2 max-w-2xl">
          Backend engineering, system architecture, API design, and technical leadership across modern enterprise software development.
        </p>
      </motion.div>

      {/* Main Experience Card - NeoVertex Solution */}
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-9 rounded-2xl bg-black/45 border border-white/15 backdrop-blur-xl shadow-2xl space-y-7"
        >
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-pixel uppercase tracking-widest text-red-400">
                  {currentExp.type}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  {currentExp.period}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {currentExp.organization}
              </h2>
              <div className="text-base sm:text-lg text-neutral-200 font-medium mt-0.5">
                {currentExp.role}
              </div>
            </div>

            {/* Core Tech Stack Badges */}
            <div className="flex flex-wrap sm:flex-col sm:items-end gap-1.5 self-start sm:self-center">
              <div className="flex flex-wrap gap-1.5">
                {currentExp.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-500/25 font-pixel font-bold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Professional Narrative */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="text-xs font-pixel uppercase tracking-widest text-neutral-400 mb-2">
              Role Overview
            </div>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
              {currentExp.description}
            </p>
          </div>

          {/* Two-Column Responsibilities: Backend & Tech Lead */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Column 1: Backend Engineering Responsibilities */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-red-400 mb-3.5">
                  <Cpu size={16} />
                  <span>Backend Development & Architecture</span>
                </div>
                <div className="space-y-3">
                  {currentExp.backendResponsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                      <CheckCircle2 size={15} className="text-red-400 mt-0.5 shrink-0" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Tech Lead Responsibilities */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-red-400 mb-3.5">
                  <ShieldCheck size={16} />
                  <span>Technical Leadership & Coordination</span>
                </div>
                <div className="space-y-3">
                  {currentExp.techLeadResponsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                      <CheckCircle2 size={15} className="text-red-400 mt-0.5 shrink-0" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full Stack Engineering Summary Note */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-300 shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Full Stack Engineering Range</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Frontend (React.js, HTML, CSS, JavaScript) + Backend (C#, ASP.NET Core, ASP.NET Web API)
              </p>
            </div>
          </div>

          <Link
            to="/resume"
            className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <span>View Full Resume</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-10 flex items-center justify-between pt-4 border-t border-white/10">
        <Link
          to="/projects"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to Projects
        </Link>
        <Link
          to="/services"
          className="text-xs font-semibold text-white hover:text-red-400 flex items-center gap-1.5 transition-colors"
        >
          <span>View Capabilities & Services</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
