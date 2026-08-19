import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Cpu, FolderGit2, Layers } from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const project = PROJECTS_DATA.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center max-w-lg mx-auto w-full my-auto">
        <div className="p-8 sm:p-10 rounded-2xl bg-black/50 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6 w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <FolderGit2 size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Project Not Found
            </h2>
            <p className="text-sm text-neutral-300 mt-2">
              The project you requested does not exist or has been renamed.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 max-w-4xl mx-auto w-full">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-center justify-between"
      >
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to All Projects</span>
        </button>

        <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-medium">
          {project.status}
        </span>
      </motion.div>

      {/* Main Project Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="p-6 sm:p-9 rounded-2xl bg-black/45 border border-white/15 backdrop-blur-xl shadow-2xl space-y-8"
      >
        {/* Title Header */}
        <div>
          <span className="text-xs font-pixel text-red-400 uppercase tracking-widest block mb-1.5">
            {project.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {project.name}
          </h1>

          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-lg bg-white/10 text-neutral-200 border border-white/10 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Structured Technology Stack Breakdown */}
        <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-neutral-400">
            <Layers size={14} className="text-red-400" />
            <span>Architecture & Technology Stack</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            {project.techStack.frontend && (
              <div className="p-3.5 rounded-lg bg-black/30 border border-white/5">
                <span className="text-neutral-400 font-pixel uppercase text-[11px] block">Frontend Architecture</span>
                <span className="text-white font-medium mt-0.5 block">{project.techStack.frontend}</span>
              </div>
            )}
            {project.techStack.backend && (
              <div className="p-3.5 rounded-lg bg-black/30 border border-white/5">
                <span className="text-neutral-400 font-pixel uppercase text-[11px] block">Backend & APIs</span>
                <span className="text-white font-medium text-red-300 mt-0.5 block">{project.techStack.backend}</span>
              </div>
            )}
            {project.techStack.database && (
              <div className="p-3.5 rounded-lg bg-black/30 border border-white/5">
                <span className="text-neutral-400 font-pixel uppercase text-[11px] block">Database & Storage</span>
                <span className="text-neutral-200 font-medium mt-0.5 block">{project.techStack.database}</span>
              </div>
            )}
            {project.techStack.tools && (
              <div className="p-3.5 rounded-lg bg-black/30 border border-white/5">
                <span className="text-neutral-400 font-pixel uppercase text-[11px] block">Developer Tooling</span>
                <span className="text-neutral-200 font-medium mt-0.5 block">{project.techStack.tools}</span>
              </div>
            )}
          </div>
        </div>

        {/* Project Overview */}
        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
          <div className="text-xs font-pixel uppercase tracking-widest text-neutral-400">
            Project Overview
          </div>
          <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
            {project.detailedDescription}
          </p>
        </div>

        {/* Key Features */}
        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
          <div className="text-xs font-pixel uppercase tracking-widest text-neutral-400">
            Key Features & System Capabilities
          </div>
          <div className="grid grid-cols-1 gap-3">
            {project.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300">
                <CheckCircle2 size={16} className="text-red-400 mt-0.5 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture & Highlights */}
        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-neutral-400">
            <Cpu size={15} className="text-red-400" />
            <span>Technical Highlights & Integration</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {project.architecture}
          </p>
        </div>

        {/* Quick Switch to Other Projects */}
        <div className="pt-6 border-t border-white/10">
          <div className="text-xs font-pixel uppercase tracking-widest text-neutral-400 mb-3">
            Explore Other Projects
          </div>
          <div className="flex flex-wrap gap-2">
            {PROJECTS_DATA.map((p) => (
              <Link
                key={p.slug}
                to={`/projects/${p.slug}`}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  p.slug === project.slug
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-bold'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/5'
                }`}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
