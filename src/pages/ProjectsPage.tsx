import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Layers } from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';

export const ProjectsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL');

  const categories = ['ALL', 'E-Commerce', 'ASP.NET Core', 'Skill Platform', 'Social', 'IoT', 'Computer Vision'];

  const filteredProjects =
    filter === 'ALL'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => {
          const lowerFilter = filter.toLowerCase();
          return (
            p.category.toLowerCase().includes(lowerFilter) ||
            p.name.toLowerCase().includes(lowerFilter) ||
            p.tech.some((t) => t.toLowerCase().includes(lowerFilter)) ||
            (p.techStack.backend && p.techStack.backend.toLowerCase().includes(lowerFilter))
          );
        });

  return (
    <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 max-w-6xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-pixel">
          Portfolio Work
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
          Featured Engineering Projects
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base mt-2 max-w-2xl">
          Real-world web platforms, quick-commerce solutions, computer vision systems, and live IoT telemetry dashboards. Each project reflects its dedicated technology architecture.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === cat
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-black/40 text-neutral-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj, idx) => (
          <motion.div
            key={proj.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={`/projects/${proj.slug}`}
              className="group h-full flex flex-col justify-between p-6 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md shadow-xl hover:border-red-500/50 hover:bg-black/55 transition-all cursor-pointer block"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-pixel text-red-400 uppercase tracking-wider line-clamp-1">
                    {proj.category}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/10 shrink-0">
                    {proj.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                    {proj.name}
                  </h3>
                  <ChevronRight
                    size={18}
                    className="text-neutral-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all shrink-0"
                  />
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 mt-2.5 leading-relaxed">
                  {proj.description}
                </p>

                {/* Structured Tech Stack Section */}
                <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-[10px] font-pixel uppercase tracking-widest text-neutral-400">
                    <Layers size={11} className="text-red-400" />
                    <span>Tech Stack</span>
                  </div>

                  {proj.techStack.frontend && (
                    <div className="text-[11px] leading-tight">
                      <span className="text-neutral-400">Frontend: </span>
                      <span className="text-neutral-200 font-medium">{proj.techStack.frontend}</span>
                    </div>
                  )}

                  {proj.techStack.backend && (
                    <div className="text-[11px] leading-tight">
                      <span className="text-neutral-400">Backend: </span>
                      <span className="text-white font-semibold text-red-300/90">{proj.techStack.backend}</span>
                    </div>
                  )}

                  {proj.techStack.database && (
                    <div className="text-[11px] leading-tight">
                      <span className="text-neutral-400">Database: </span>
                      <span className="text-neutral-300">{proj.techStack.database}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Badges & Link */}
              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {proj.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                  {proj.tech.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                      +{proj.tech.length - 3}
                    </span>
                  )}
                </div>

                <span className="text-xs font-pixel text-neutral-400 group-hover:text-red-400 transition-colors shrink-0 flex items-center gap-1">
                  Details <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="mt-10 flex items-center justify-between pt-4 border-t border-white/10">
        <Link
          to="/skills"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to Skills
        </Link>
        <Link
          to="/experience"
          className="text-xs font-semibold text-white hover:text-red-400 flex items-center gap-1.5 transition-colors"
        >
          <span>View Experience & Journey</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
