import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/portfolioData';

export const BlogPage: React.FC = () => {
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
          Articles & Writeups
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
          Technical Blog & Insights
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base mt-2 max-w-2xl">
          Deep dives into full-stack engineering, real-time IoT architecture, and computer vision systems.
        </p>
      </motion.div>

      {/* Blog Cards */}
      <div className="space-y-6">
        {BLOG_POSTS.map((post, idx) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="group block p-6 sm:p-8 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md shadow-xl hover:border-red-500/40 hover:bg-black/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-pixel uppercase tracking-widest text-red-400">
                    {post.category}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
                <span className="text-xs font-pixel text-neutral-400">{post.date}</span>
              </div>

              <div className="flex items-center justify-between gap-4 mt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-red-300 transition-colors">
                  {post.title}
                </h3>
                <ChevronRight
                  size={20}
                  className="text-neutral-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all shrink-0"
                />
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-1 text-xs font-pixel text-neutral-400 group-hover:text-red-400 transition-colors">
                <span>Read Full Article</span>
                <ArrowRight size={13} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="mt-10 flex items-center justify-between pt-4 border-t border-white/10">
        <Link
          to="/services"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to Services
        </Link>
        <Link
          to="/contact"
          className="text-xs font-semibold text-white hover:text-red-400 flex items-center gap-1.5 transition-colors"
        >
          <span>Contact Me</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
