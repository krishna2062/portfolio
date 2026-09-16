"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/variants';
import CountUp from 'react-countup';

export default function About() {
  const [activeTab, setActiveTab] = useState<'experience' | 'status'>('experience');

  return (
    <div className="min-h-screen h-auto bg-primary/30 pt-24 lg:pt-36 pb-28 lg:pb-20 px-4 sm:px-8 lg:px-16 flex items-center relative overflow-y-auto overflow-x-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT: Dedicated Avatar Card (Zero Overlap) */}
          <motion.div 
            variants={fadeIn('right', 0.2)}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 relative w-full h-[300px] sm:h-[400px] lg:h-[550px] rounded-2xl bg-white/5 border border-white/10 flex items-end justify-center overflow-hidden mb-6 lg:mb-0"
          >
            <img 
              src="/assets/krishna.png" 
              alt="Krishna Prasad Bhandari" 
              className="max-h-full object-contain object-bottom select-none pointer-events-none"
              style={{
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
              }}
            />
          </motion.div>

          {/* RIGHT: Content, Counters & Tabs */}
          <motion.div 
            variants={fadeIn('left', 0.4)}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col justify-center space-y-4 lg:space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Passionate software <br className="hidden sm:block" />
              <span className="text-[#f13024]">engineer based in Nepal.</span>
            </h2>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Focused on building scalable enterprise solutions, performant REST APIs, clean database designs, and hardware-software telemetry integrations.
            </p>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 border-y border-white/10 text-center sm:text-left">
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#f13024]">
                  <CountUp start={0} end={2} duration={5} />+
                </h4>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/60 mt-1">Years of Experience</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#f13024]">
                  <CountUp start={0} end={10} duration={5} />+
                </h4>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/60 mt-1">Completed Projects</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#f13024]">
                  <CountUp start={0} end={8} duration={5} />+
                </h4>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/60 mt-1">Tech Mastered</p>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-4 sm:gap-6 border-b border-white/10 pb-2">
              <button 
                onClick={() => setActiveTab('experience')}
                className={`text-xs sm:text-sm font-semibold pb-1 transition-colors relative ${activeTab === 'experience' ? 'text-[#f13024]' : 'text-white/60 hover:text-white'}`}
              >
                Experience
                {activeTab === 'experience' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f13024]" />}
              </button>
              <button 
                onClick={() => setActiveTab('status')}
                className={`text-xs sm:text-sm font-semibold pb-1 transition-colors relative ${activeTab === 'status' ? 'text-[#f13024]' : 'text-white/60 hover:text-white'}`}
              >
                Status
                {activeTab === 'status' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f13024]" />}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2 text-sm text-white/80 min-h-[100px] lg:min-h-[80px]">
              {activeTab === 'experience' ? (
                <div>
                  <p className="font-semibold text-white">Backend Developer & Tech Lead — NeoVertex Solution</p>
                  <p className="text-xs text-[#f13024] mt-0.5">Primary Tech: C#, ASP.NET Core, SQL Server, EF Core</p>
                  <p className="text-xs text-white/60 mt-2">Designing scalable APIs, authentication layers, and enterprise services.</p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-white">BE in Computer Engineering (4th Semester)</p>
                  <p className="text-xs text-[#f13024] mt-0.5">Lumbini Engineering College (Pokhara University)</p>
                  <p className="text-xs text-white/60 mt-2">Focusing on Operating Systems, Database Architecture, and Embedded IoT.</p>
                </div>
              )}
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}
