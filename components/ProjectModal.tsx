import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiX } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";

export interface ProjectData {
  title: string;
  path: string;
  link: string;
  tech: string[];
  description: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-3xl bg-[#131424] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-[#f13024] text-white rounded-full transition-colors duration-300"
            >
              <FiX className="text-xl" />
            </button>

            {/* Scrollable Body */}
            <div 
              className="overflow-y-auto custom-scrollbar flex-1"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Hero Image */}
              <div className="relative w-full h-64 sm:h-80">
                <Image
                  src={project.path}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131424] via-transparent to-transparent" />
              </div>

              {/* Content Container */}
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                
                {/* Header */}
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    {project.title}
                  </h3>
                  
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((techItem, index) => (
                      <span
                        key={index}
                        className="bg-[#f13024]/10 text-[#f13024] border border-[#f13024]/30 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-white/80 mb-2">Project Overview</h4>
                  <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                    {project.description}
                  </p>
                </div>

              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row gap-4 justify-end shrink-0">
              <Link
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
                className="btn rounded-full border border-white/50 px-8 transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-[#f13024] group h-12"
              >
                <span className="group-hover:-translate-y-[120%] group-hover:opacity-0 transition-all duration-500 font-medium">
                  Open Live Demo
                </span>
                <BsArrowRight className="translate-y-[120%] opacity-0 group-hover:flex group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 absolute text-[22px]" aria-hidden />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
