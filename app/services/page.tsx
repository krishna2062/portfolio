"use client";

import { motion } from "framer-motion";

import Bulb from "@/components/Bulb";
import Circles from "@/components/Circles";
import ServiceSlider from "@/components/ServiceSlider";
import { fadeIn } from "@/variants";

const Services = () => {
  return (
    <div className="min-h-screen h-auto bg-primary/30 pt-24 lg:pt-36 pb-28 lg:pb-0 flex items-center relative overflow-y-auto overflow-x-hidden">
      <Circles />
      <div className="container mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col xl:flex-row gap-x-8 gap-y-4 xl:gap-y-0 items-center justify-center w-full h-full xl:min-h-screen">
          <div className="text-center flex xl:w-[30vw] flex-col lg:text-left mb-2 xl:mb-0">
            <motion.h2
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="h2 xl:mt-8"
            >
              My services <span className="text-accent">.</span>
            </motion.h2>
            <motion.p
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="max-w-100 mx-auto lg:mx-0 text-sm sm:text-base text-white/70">
              I build reliable, scalable, and user-focused digital solutions that help businesses turn ideas into practical software.
            </motion.p>
          </div>

          <motion.div
            variants={fadeIn("down", 0.6)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="w-full xl:max-w-[65%] mt-2 xl:mt-0"
          >
            <ServiceSlider />
          </motion.div>
        </div>
      </div>
      <Bulb />
    </div>
  );
};

export default Services;
