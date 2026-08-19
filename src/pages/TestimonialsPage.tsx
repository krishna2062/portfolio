import React from 'react';
import { motion } from 'motion/react';
import { MessageSquareQuote, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TESTIMONIALS_DATA } from '../data/portfolioData';

export const TestimonialsPage: React.FC = () => {
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
          Endorsements
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
          Testimonials & Collaborations
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base mt-2 max-w-2xl">
          Feedback from project teammates, engineering peers, and academic collaborators.
        </p>
      </motion.div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TESTIMONIALS_DATA.map((t, idx) => (
          <motion.div
            key={t.name + t.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md shadow-xl hover:border-red-500/40 hover:bg-black/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                  <MessageSquareQuote size={20} />
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-200 mt-4 leading-relaxed italic">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-sm font-bold text-white">{t.name}</h4>
              <p className="text-xs text-red-400 font-pixel mt-0.5">{t.role}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{t.context}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="mt-10 flex items-center justify-between pt-4 border-t border-white/10">
        <Link
          to="/certifications"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to Certifications
        </Link>
        <Link
          to="/contact"
          className="text-xs font-semibold text-white hover:text-red-400 flex items-center gap-1.5 transition-colors"
        >
          <span>Get in Touch / Contact</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
