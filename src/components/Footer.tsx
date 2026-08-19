import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/30 backdrop-blur-md py-4 px-5 sm:px-6 md:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60 relative z-20">
      <div>
        <span>Krishna Prasad Bhandari • Full Stack Developer</span>
        <span className="hidden md:inline"> (Lumbini Engineering College, Pokhara University)</span>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <Link to="/about" className="hover:text-white transition-colors">About</Link>
        <Link to="/experience" className="hover:text-white transition-colors">Experience</Link>
        <Link to="/education" className="hover:text-white transition-colors">Education</Link>
        <Link to="/skills" className="hover:text-white transition-colors">Skills</Link>
        <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
        <Link to="/resume" className="hover:text-white transition-colors">Resume</Link>
        <Link to="/contact" className="hover:text-white transition-colors text-red-400">Contact</Link>
      </div>
    </footer>
  );
};
