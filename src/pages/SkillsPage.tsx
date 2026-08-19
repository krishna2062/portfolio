import React from 'react';
import { motion } from 'motion/react';
import { Code2, Layers, Cpu, Database, Terminal, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SKILL_CATEGORIES } from '../data/portfolioData';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Frontend Development':
      return <Layers size={20} className="text-red-400" />;
    case 'Backend & Specialization':
      return <Cpu size={20} className="text-red-400" />;
    case 'Databases & Storage':
      return <Database size={20} className="text-red-400" />;
    case 'Programming Languages':
      return <Code2 size={20} className="text-red-400" />;
    case 'Developer Tools & Environments':
      return <Terminal size={20} className="text-red-400" />;
    case 'Research & Emerging Areas':
      return <Sparkles size={20} className="text-red-400" />;
    default:
      return <Code2 size={20} className="text-red-400" />;
  }
};

export const SkillsPage: React.FC = () => {
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
          Technical Stack
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
          Skills & Technologies
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base mt-2 max-w-2xl">
          Full-stack proficiency spanning modern frontend frameworks, C# / ASP.NET Core backend engineering, database architectures, and developer tooling.
        </p>
      </motion.div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md shadow-xl hover:border-red-500/40 hover:bg-black/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  {getCategoryIcon(cat.category)}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-pixel">
                  {cat.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm text-neutral-200 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Navigation Footer */}
      <div className="mt-10 flex items-center justify-between pt-4 border-t border-white/10">
        <Link
          to="/education"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to Education
        </Link>
        <Link
          to="/projects"
          className="text-xs font-semibold text-white hover:text-red-400 flex items-center gap-1.5 transition-colors"
        >
          <span>View Featured Projects</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
