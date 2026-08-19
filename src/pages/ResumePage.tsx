import React from 'react';
import { motion } from 'motion/react';
import { Mail, GraduationCap, Briefcase, Code2, FolderGit2, Sparkles, Printer, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECTS_DATA } from '../data/portfolioData';

export const ResumePage: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-6 sm:py-10 max-w-4xl mx-auto w-full resume-page-container">
      {/* Top Action Bar (Hidden on Print) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print"
      >
        <div>
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-pixel">
            Curriculum Vitae
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-0.5">
            Developer Resume
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print or save resume as PDF"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer size={14} />
            <span>Print / Save</span>
          </button>
          <Link
            to="/contact"
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Mail size={14} />
            <span>Contact</span>
          </Link>
        </div>
      </motion.div>

      {/* Main Resume Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="resume-document p-6 sm:p-10 rounded-2xl bg-black/45 border border-white/15 backdrop-blur-xl shadow-2xl space-y-8 text-neutral-200"
      >
        {/* 1. HEADER & IDENTITY */}
        <div className="resume-section border-b border-white/10 pb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight resume-name">
            KRISHNA PRASAD BHANDARI
          </h2>
          <p className="text-sm sm:text-base font-pixel text-red-400 uppercase tracking-widest mt-1 resume-title">
            FULL STACK DEVELOPER
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-neutral-300 resume-stack-row">
            <div>
              <span className="text-neutral-400 font-pixel uppercase resume-label">Frontend: </span>
              <span className="text-white font-medium resume-val">React.js, HTML, CSS, JavaScript</span>
            </div>
            <div>
              <span className="text-neutral-400 font-pixel uppercase resume-label">Backend: </span>
              <span className="text-white font-medium resume-val">C#, ASP.NET Core, ASP.NET Web API</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 pt-2 border-t border-white/5 resume-contact-bar">
            <span>Email: <strong className="text-neutral-200 resume-bold">krishnabhandari2062@gmail.com</strong></span>
            <span className="resume-divider">•</span>
            <span>Location: <strong className="text-neutral-200 resume-bold">Nepal</strong></span>
            <span className="resume-divider">•</span>
            <span>Academic: <strong className="text-neutral-200 resume-bold">Lumbini Engineering College (Pokhara University)</strong></span>
          </div>
        </div>

        {/* 2. PROFESSIONAL SUMMARY */}
        <div className="resume-section space-y-2">
          <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-red-400 resume-section-title">
            <Sparkles size={15} className="no-print" />
            <span>Professional Summary</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed p-4 rounded-xl bg-white/[0.02] border border-white/5 resume-summary-box">
            I’m Krishna Prasad Bhandari, a Computer Engineering student and Full Stack Developer focused on building modern, scalable, and user-centered web applications. I work across frontend and backend technologies, with experience in React, HTML, CSS, JavaScript, C#, and ASP.NET. I enjoy transforming ideas into functional digital products while continuously exploring APIs, databases, cybersecurity, IoT, AI, and emerging technologies.
          </p>
        </div>

        {/* 3. EXPERIENCE */}
        <div className="resume-section space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-red-400 resume-section-title">
            <Briefcase size={15} className="no-print" />
            <span>Professional Experience</span>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-4 resume-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-white/10 resume-card-header">
              <div>
                <h3 className="text-lg font-bold text-white resume-org">NeoVertex Solution</h3>
                <p className="text-sm font-medium text-red-300 resume-role">Backend Developer & Tech Lead</p>
              </div>
              <span className="text-xs font-pixel px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 self-start sm:self-center resume-badge">
                Current Role / Present
              </span>
            </div>

            <div>
              <span className="text-xs text-neutral-400 font-pixel uppercase block mb-1 resume-label">Technology:</span>
              <div className="flex flex-wrap gap-1.5 resume-tech-tags">
                {['C#', 'ASP.NET', 'ASP.NET Core', 'ASP.NET Web API'].map((t) => (
                  <span key={t} className="text-xs px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-200 resume-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-neutral-400 font-pixel uppercase block mb-2 resume-label">Key Responsibilities:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 resume-resp-grid">
                {[
                  'Backend development',
                  'REST API development',
                  'Backend architecture',
                  'API integration',
                  'Database integration',
                  'Authentication and authorization',
                  'Code review',
                  'Technical decision making',
                  'Technical guidance',
                  'Development workflow support',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 resume-resp-item">
                    <CheckCircle2 size={13} className="text-red-400 shrink-0 resume-bullet" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. TECHNICAL SKILLS */}
        <div className="resume-section space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-red-400 resume-section-title">
            <Code2 size={15} className="no-print" />
            <span>Technical Skills</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs resume-skills-grid">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 resume-skill-box">
              <span className="text-neutral-400 font-pixel uppercase block resume-label">Frontend</span>
              <span className="text-white font-medium mt-1 block resume-val">React.js, HTML, CSS, JavaScript</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 resume-skill-box">
              <span className="text-neutral-400 font-pixel uppercase block resume-label">Backend</span>
              <span className="text-white font-medium mt-1 block resume-val">C#, ASP.NET, ASP.NET Core, ASP.NET Web API</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 resume-skill-box">
              <span className="text-neutral-400 font-pixel uppercase block resume-label">Database</span>
              <span className="text-white font-medium mt-1 block resume-val">MongoDB, SQL, Firebase, PostgreSQL</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 resume-skill-box">
              <span className="text-neutral-400 font-pixel uppercase block resume-label">Programming Languages</span>
              <span className="text-white font-medium mt-1 block resume-val">C, C++, C#, Java, Python, JavaScript</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 resume-skill-box">
              <span className="text-neutral-400 font-pixel uppercase block resume-label">Tools & Environments</span>
              <span className="text-white font-medium mt-1 block resume-val">Git, GitHub, VS Code, Visual Studio</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 resume-skill-box">
              <span className="text-neutral-400 font-pixel uppercase block resume-label">Additional Focus</span>
              <span className="text-white font-medium mt-1 block resume-val">APIs, Cybersecurity, IoT, AI, Research, New Technologies</span>
            </div>
          </div>
        </div>

        {/* 5. EDUCATION */}
        <div className="resume-section space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-red-400 resume-section-title">
            <GraduationCap size={15} className="no-print" />
            <span>Education</span>
          </div>

          <div className="space-y-3 resume-edu-list">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 resume-card">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white resume-edu-title">
                  Bachelor of Engineering in Computer Engineering
                </h4>
                <p className="text-xs text-neutral-300 resume-edu-school">
                  Lumbini Engineering College • Pokhara University
                </p>
              </div>
              <span className="text-xs font-pixel px-2.5 py-1 rounded bg-red-500/20 text-red-300 self-start sm:self-center resume-badge">
                Current: 4th Semester
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 resume-card">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white resume-edu-title">
                  SLC in IT Engineering
                </h4>
                <p className="text-xs text-neutral-300 resume-edu-school">Higher Secondary Technical Education</p>
              </div>
              <span className="text-xs font-pixel px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 self-start sm:self-center resume-badge">
                GPA: 3.36
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 resume-card">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white resume-edu-title">
                  SEE in IT Engineering
                </h4>
                <p className="text-xs text-neutral-300 resume-edu-school">Secondary Technical School</p>
              </div>
              <span className="text-xs font-pixel px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 self-start sm:self-center resume-badge">
                GPA: 3.28
              </span>
            </div>
          </div>
        </div>

        {/* 6. PROJECTS HIGHLIGHT */}
        <div className="resume-section space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-red-400 resume-section-title">
            <FolderGit2 size={15} className="no-print" />
            <span>Featured Engineering Projects</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 resume-proj-grid">
            {PROJECTS_DATA.slice(0, 4).map((p) => (
              <div
                key={p.slug}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 resume-card"
              >
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-sm font-bold text-white resume-proj-name">{p.name}</h5>
                  <span className="text-[10px] font-pixel text-red-400 resume-proj-cat">{p.category}</span>
                </div>
                <p className="text-xs text-neutral-300 mt-1.5 line-clamp-2 leading-relaxed resume-proj-desc">
                  {p.description}
                </p>
                <div className="mt-2 text-[11px] text-neutral-400 resume-proj-stack">
                  <span className="font-semibold text-neutral-300">Backend: </span>
                  <span>{p.techStack.backend || p.tech.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. RESEARCH & INTERESTS */}
        <div className="resume-section space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-pixel uppercase tracking-widest text-red-400 resume-section-title">
            <Sparkles size={15} className="no-print" />
            <span>Interests & Research Focus</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs resume-interests-grid">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center resume-card">
              <span className="text-white font-bold block text-sm resume-int-title">Coding & Software Development</span>
              <span className="text-neutral-400 text-xs mt-1 block resume-int-desc">Full-stack web apps, C# backends, and APIs</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center resume-card">
              <span className="text-white font-bold block text-sm resume-int-title">Research & Technical Exploration</span>
              <span className="text-neutral-400 text-xs mt-1 block resume-int-desc">System architecture, algorithms, and security</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center resume-card">
              <span className="text-white font-bold block text-sm resume-int-title">Exploring New Technologies</span>
              <span className="text-neutral-400 text-xs mt-1 block resume-int-desc">IoT telemetry, AI models, and modern frameworks</span>
            </div>
          </div>
        </div>

        {/* 8. CONTACT & FOOTER */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400 resume-footer">
          <div>
            Direct Email: <a href="mailto:krishnabhandari2062@gmail.com" className="text-white hover:text-red-400 transition-colors underline resume-email-link">krishnabhandari2062@gmail.com</a>
          </div>
          <Link
            to="/contact"
            className="text-xs font-semibold text-white hover:text-red-400 flex items-center gap-1.5 transition-colors self-start sm:self-auto no-print"
          >
            <span>Open Contact Form</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
