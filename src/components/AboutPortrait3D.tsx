import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import portraitImg from '../assets/12.jpeg';

export const AboutPortrait3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Normalized cursor coordinates (-0.5 to 0.5 from center)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physics-based springs for fluid tilt
  const springConfig = { damping: 22, stiffness: 240, mass: 0.6 };
  // left -> negative rotateY, right -> positive rotateY
  // up -> positive rotateX, down -> negative rotateX
  const rawRotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rawRotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);

  // Dynamic glare coordinates
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['20%', '80%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['20%', '80%']);
  const rawGlareOpacity = useTransform(mouseX, (x: number) => (x !== 0 ? 0.3 : 0));
  const glareOpacity = useSpring(rawGlareOpacity, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="flex items-center justify-center lg:justify-end w-full py-2">
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, x: 100, scale: 0.9, rotateY: 12 }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
          rotateY: 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          perspective: 1200,
          transformStyle: 'preserve-3d',
        }}
        className="relative group w-full max-w-[280px] sm:max-w-[330px] md:max-w-[380px] lg:max-w-[440px] xl:max-w-[480px]"
      >
        {/* 3D Tilting Card Surface */}
        <motion.div
          style={{
            rotateX: shouldReduceMotion ? 0 : rotateX,
            rotateY: shouldReduceMotion ? 0 : rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.01] border border-white/15 p-3 sm:p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden transition-shadow duration-300 group-hover:border-red-500/40 group-hover:shadow-[0_30px_60px_-15px_rgba(239,68,68,0.25)]"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 -z-10 bg-radial from-red-500/20 via-transparent to-transparent blur-2xl scale-125 opacity-70 pointer-events-none" />

          {/* Interactive Specular Glare */}
          {!shouldReduceMotion && (
            <motion.div
              style={{
                left: glareX,
                top: glareY,
                opacity: glareOpacity,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute w-56 h-56 rounded-full bg-radial from-white/25 via-red-400/10 to-transparent blur-xl pointer-events-none -z-0"
            />
          )}

          {/* Floating Portrait Image with 3D Pop */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -8, 0],
                    rotateZ: [0, 1, 0],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              transform: 'translateZ(26px)',
              transformStyle: 'preserve-3d',
            }}
            className="relative flex items-center justify-center"
          >
            <img
              src={portraitImg || '/12.jpeg'}
              alt="Krishna Prasad Bhandari"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = '1';
                  target.src = '/12.jpeg';
                } else if (target.dataset.triedFallback === '1') {
                  target.dataset.triedFallback = '2';
                  target.src = '/assets/12.jpeg';
                }
              }}
              className="w-full h-auto max-h-[320px] sm:max-h-[360px] md:max-h-[400px] lg:max-h-[440px] xl:max-h-[480px] object-contain rounded-xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* 3D Floating Nameplate Badge */}
          <motion.div
            style={{
              transform: 'translateZ(40px)',
            }}
            className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 px-3 py-1 rounded-lg bg-black/85 border border-white/20 backdrop-blur-md text-[10px] sm:text-[11px] font-pixel uppercase tracking-widest text-neutral-200 flex items-center gap-1.5 shadow-2xl"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Krishna Prasad Bhandari</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
