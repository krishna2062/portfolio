"use client";

import { motion } from "framer-motion";

import Circles from "@/components/Circles";
import Bulb from "@/components/Bulb";
import { fadeIn } from "@/variants";

const educationData = [
  {
    degree: "Bachelor of Engineering in Computer Engineering (BE Computer)",
    institution: "Lumbini Engineering College (Pokhara University)",
    status: "4th Semester Enrolled",
  },
  {
    degree: "Higher Secondary Education (IT Engineering)",
    institution: "Higher Secondary Board",
    status: "Academic Score: GPA 3.36 (Graduated)",
  },
  {
    degree: "Secondary Education Examination (SEE - IT Engineering)",
    institution: "National Examination Board",
    status: "Academic Score: GPA 3.28 (Graduated)",
  },
];

const Education = () => {
  return (
    <div className="h-full bg-primary/30 py-32 flex items-center">
      <Circles />
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-x-8">
          <div className="text-center flex xl:w-[30vw] flex-col lg:text-left mb-4 xl:mb-0">
            <motion.h2
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="h2 xl:mt-12"
            >
              My education <span className="text-accent">.</span>
            </motion.h2>
            <motion.p
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="mb-4 max-w-100 mx-auto lg:mx-0"
            >
              A strong academic foundation in Computer Engineering, continuously learning and applying engineering principles to solve real-world problems.
            </motion.p>
          </div>

          <motion.div
            variants={fadeIn("down", 0.6)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="w-full xl:max-w-[65%] flex flex-col gap-6"
          >
            {educationData.map((item, index) => (
              <div
                key={index}
                className="bg-[rgba(65,47,123,0.15)] rounded-lg p-6 relative group overflow-hidden border border-white/5 hover:border-accent/50 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                <div className="text-xl font-bold mb-1 text-white">
                  {item.degree}
                </div>
                <div className="text-accent/80 font-medium text-lg mb-2">
                  {item.institution}
                </div>
                <div className="text-white/60 text-sm">
                  {item.status}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <Bulb />
    </div>
  );
};

export default Education;
