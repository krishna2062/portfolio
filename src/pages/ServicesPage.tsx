import React from 'react';
import { motion } from 'motion/react';
import { Layers, Cpu, Database, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES_DATA } from '../data/portfolioData';

const getServiceIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Globe size={24} className="text-red-400" />;
    case 1:
      return <Layers size={24} className="text-red-400" />;
    case 2:
      return <Cpu size={24} className="text-red-400" />;
    case 3:
      return <Database size={24} className="text-red-400" />;
    default:
      return <Globe size={24} className="text-red-400" />;
  }
};

export const ServicesPage: React.FC = () => {
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
          What I Deliver
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
          Capabilities & Engineering Services
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base mt-2 max-w-2xl">
          High-performance web applications, intuitive frontend user interfaces, robust backend APIs, and hardware telemetry systems.
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES_DATA.map((srv, idx) => (
          <motion.div
            key={srv.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md shadow-xl hover:border-red-500/40 hover:bg-black/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  {getServiceIcon(idx)}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-pixel">
                  {srv.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 mt-4 leading-relaxed">
                {srv.description}
              </p>

              <div className="mt-5 space-y-2.5">
                {srv.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <CheckCircle2 size={15} className="text-red-400 mt-0.5 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/40 via-black/50 to-black/40 border border-red-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div>
          <h4 className="text-lg sm:text-xl font-bold text-white">Have a project in mind?</h4>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1">
            Let&apos;s collaborate on building modern, scalable, and responsive applications.
          </p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-lg"
        >
          Start a Conversation
        </Link>
      </motion.div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/10">
        <Link
          to="/experience"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to Experience
        </Link>
        <Link
          to="/blog"
          className="text-xs font-semibold text-white hover:text-red-400 flex items-center gap-1.5 transition-colors"
        >
          <span>Read Technical Blog</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
