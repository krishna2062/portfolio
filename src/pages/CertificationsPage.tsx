import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CERTIFICATIONS_DATA } from '../data/portfolioData';

export const CertificationsPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 max-w-5xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-pixel">
          Credentials
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
          Certifications & Credentials
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base mt-2 max-w-2xl">
          Formal engineering milestones, academic certifications, and specialized technical qualifications.
        </p>
      </motion.div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CERTIFICATIONS_DATA.map((cert, idx) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md shadow-xl hover:border-red-500/40 hover:bg-black/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                  <Award size={20} />
                </div>
                <span className="text-xs font-pixel text-neutral-400">{cert.year}</span>
              </div>

              <div className="mt-4">
                <span className="text-xs font-pixel text-red-400 uppercase tracking-wider block mb-1">
                  {cert.field}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {cert.title}
                </h3>
                <p className="text-xs text-neutral-300 font-medium mt-1">
                  {cert.issuer}
                </p>
              </div>

              <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                {cert.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="mt-10 flex items-center justify-between pt-4 border-t border-white/10">
        <Link
          to="/education"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to Education
        </Link>
        <Link
          to="/testimonials"
          className="text-xs font-semibold text-white hover:text-red-400 flex items-center gap-1.5 transition-colors"
        >
          <span>View Testimonials</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
