"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import ParticlesContainer from "@/components/ParticlesContainer";
import ProjectsBtn from "@/components/ProjectsBtn";
import Avatar from "@/components/Avatar";
import { fadeIn } from "@/variants";

const Home = () => {
  return (
    <div className="relative w-full min-h-screen h-auto overflow-y-auto overflow-x-hidden bg-[#0c0c14] flex flex-col justify-between">
      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full flex z-0 pointer-events-none fixed">
        {/* Left Nebula Gradient */}
        <div className="w-full lg:w-1/2 h-full bg-linear-to-r from-primary/20 via-black/40 to-black/10" />
        {/* Right Stone Gradient */}
        <div className="hidden lg:block w-1/2 h-full bg-linear-to-l from-stone-900/60 to-transparent mix-blend-overlay" />
      </div>

      <div className="absolute inset-0 z-0 fixed">
        <ParticlesContainer />
      </div>

      {/* Main Grid Layout */}
      <div className="container mx-auto relative z-10 px-6 sm:px-12 lg:px-20 pt-20 pb-28 sm:pb-32 md:pt-32 md:pb-20 flex flex-col justify-center min-h-screen">
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-20">
          
          {/* ====================================================
              AVATAR / IMAGE CONTAINER
              Mobile: order-1 (Fills the empty top space right below Header)
              Desktop: order-2 (lg:col-span-5 on the right side)
             ==================================================== */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center items-end relative w-full pt-4 lg:pt-0">
            {/* Wall Light Pillar & Fixture (Desktop Only) */}
            <div className="absolute right-0 top-0 h-full w-24 bg-stone-800/90 border-l border-r border-white/10 shadow-2xl flex-col items-center pt-32 z-0 hidden lg:flex">
              <div className="w-10 h-36 bg-zinc-800 rounded-sm relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-orange-400/20 blur-2xl rounded-full" />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-4 bg-orange-100 blur-[2px] rounded-full" />
                <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-80 h-48 bg-orange-500/30 blur-3xl rounded-full" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-4 bg-orange-100 blur-[2px] rounded-full" />
              </div>
            </div>

            {/* Floating Badges (Desktop Only) */}
            <motion.div
              variants={fadeIn("right", 0.6)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="absolute left-0 bottom-32 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white/80 z-20 hidden lg:block"
            >
              <span className="text-[#f13024]">async</span> function fetchTelemetry()...
            </motion.div>

            <motion.div
              variants={fadeIn("left", 0.7)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="absolute right-12 top-1/3 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white/80 z-20 hidden lg:block"
            >
              IoT Sensor Data
            </motion.div>

            <motion.div 
              variants={fadeIn("up", 0.5)}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ duration: 1, ease: "easeInOut" }}
              className="relative w-[240px] h-[300px] sm:w-[320px] sm:h-[400px] lg:w-[480px] lg:h-[580px] z-10"
            >
              {/* Subtle Ambient Red Glow behind Avatar */}
              <div className="absolute inset-0 bg-[#f13024]/15 rounded-full blur-2xl pointer-events-none" />

              {/* Profile Image with smooth bottom fade */}
              <Avatar />
            </motion.div>
          </div>

          {/* ====================================================
              TEXT & CTAs CONTAINER
              Mobile: order-2 (Renders cleanly under the photo)
              Desktop: order-1 (lg:col-span-7 on the left side)
             ==================================================== */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center text-center lg:text-left z-20 space-y-4">
            <motion.h1
              variants={fadeIn("down", 0.2)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight"
            >
              Full Stack Developer <br />
              & Computer Engineering <br />
              <span className="text-[#f13024]">Student</span>
            </motion.h1>

            <motion.p
              variants={fadeIn("down", 0.3)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="text-sm sm:text-base text-white/70 max-w-[480px] mx-auto lg:mx-0 leading-relaxed my-2"
            >
              Specializing in high-performance web applications, robust ASP.NET Core backend architecture, modern React interfaces, and hardware telemetry.
            </motion.p>

            {/* CTA Buttons Row */}
            <motion.div
              variants={fadeIn("down", 0.4)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="flex items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <ProjectsBtn />
              <Link href="/contact" className="px-6 py-2.5 rounded-full border border-white/20 text-white font-medium hover:border-[#f13024] hover:text-[#f13024] transition-all duration-300">
                Contact Me
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
