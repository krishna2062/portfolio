"use client";

import { motion } from "framer-motion";

import Circles from "@/components/Circles";
import Bulb from "@/components/Bulb";
import { fadeIn } from "@/variants";

const skillsData = [
  {
    category: "Frontend",
    skills: "React.js, Next.js, HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, Framer Motion",
  },
  {
    category: "Backend",
    skills: "C#, ASP.NET Core, ASP.NET Web API, Node.js, Express.js, Django, FastAPI",
  },
  {
    category: "Databases",
    skills: "SQL Server, PostgreSQL, MongoDB, SQLite, Firebase Firestore",
  },
  {
    category: "Languages",
    skills: "C, C++, C#, Python, JavaScript, TypeScript, Java",
  },
  {
    category: "Tools & DevOps",
    skills: "Git, GitHub, Visual Studio, VS Code, Postman, Docker, Kali Linux",
  },
  {
    category: "Core Domains",
    skills: "RESTful System Architecture, WebSockets, IoT Telemetry, Computer Vision (OpenCV)",
  },
];

const Skills = () => {
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
              My skills <span className="text-accent">.</span>
            </motion.h2>
            <motion.p
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="mb-4 max-w-100 mx-auto lg:mx-0"
            >
              Mastering a wide array of tools and technologies to build complete, scalable solutions from the database to the user interface.
            </motion.p>
          </div>

          <motion.div
            variants={fadeIn("down", 0.6)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="w-full xl:max-w-[65%] grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {skillsData.map((item, index) => (
              <div
                key={index}
                className="bg-[rgba(65,47,123,0.15)] rounded-lg p-6 hover:bg-[rgba(89,65,169,0.15)] transition-all duration-300 cursor-pointer border border-white/5 hover:border-accent/50"
              >
                <div className="text-accent text-xl font-bold mb-2">
                  {item.category}
                </div>
                <div className="text-white/80 leading-relaxed text-sm">
                  {item.skills}
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

export default Skills;
