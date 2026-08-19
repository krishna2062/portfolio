import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

export const GLOBAL_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260723_145606_ab143199-b593-4941-bb1b-9afca215416b.mp4';

export const GlobalVideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (videoRef.current) {
      if (shouldReduceMotion) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Fallback handled silently
        });
      }
    }
  }, [shouldReduceMotion]);

  return (
    <>
      {/* 1. Global Fixed Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-20 pointer-events-none"
        src={GLOBAL_VIDEO_URL}
      />

      {/* 2. Global Contrast Overlay (35% opacity) */}
      <div className="fixed inset-0 -z-10 bg-black/35 pointer-events-none" />
    </>
  );
};
