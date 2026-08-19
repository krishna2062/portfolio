import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../data/portfolioData';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center max-w-lg mx-auto w-full my-auto">
        <div className="p-8 sm:p-10 rounded-2xl bg-black/50 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6 w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <BookOpen size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Article Not Found
            </h2>
            <p className="text-sm text-neutral-300 mt-2">
              The article you are looking for does not exist or may have been updated.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Blog</span>
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
        className="mb-6"
      >
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to All Articles</span>
        </button>
      </motion.div>

      {/* Main Article Container */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="p-6 sm:p-10 rounded-2xl bg-black/45 border border-white/15 backdrop-blur-xl shadow-2xl space-y-8"
      >
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-pixel uppercase tracking-widest text-red-400">
              {post.category}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Clock size={12} /> {post.readTime}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-xs text-neutral-400">{post.date}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-neutral-200 leading-relaxed">
          {post.content.map((paragraph, i) => (
            <p key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Other Articles */}
        <div className="pt-6 border-t border-white/10">
          <div className="text-xs font-pixel uppercase tracking-widest text-neutral-400 mb-4">
            More Articles
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug).map((other) => (
              <Link
                key={other.slug}
                to={`/blog/${other.slug}`}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-red-500/40 transition-colors block"
              >
                <div className="text-xs font-pixel text-red-400 uppercase">{other.category}</div>
                <h4 className="text-sm font-bold text-white mt-1 line-clamp-2">{other.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      </motion.article>
    </div>
  );
};
