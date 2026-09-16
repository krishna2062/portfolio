"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import ProjectModal, { ProjectData } from "./ProjectModal";

const workSlides = {
  slides: [
    {
      images: [
        {
          title: "Hamro Kirana",
          path: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
          link: "https://krishnabhandari01.com.np",
          tech: ["React", "C#", "ASP.NET Core Web API", "SQL Server", "EF Core"],
          description: "Nepal-focused local quick-commerce platform connecting buyers and local sellers with real-time cart, checkout, inventory management, and ASP.NET Core Web API architecture.",
        },
        {
          title: "SkillNepal",
          path: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          link: "https://krishnabhandari01.com.np",
          tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
          description: "Digital education and skill platform focused on connecting learners with hands-on technical roadmaps, learning resources, and career opportunities.",
        },
        {
          title: "Together",
          path: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
          link: "https://krishnabhandari01.com.np",
          tech: ["React.js", "Firebase", "Firestore"],
          description: "Interactive social networking platform concept featuring real-time feed updates, user interactions, messaging channels, and reactive state management.",
        },
        {
          title: "IoT Air Purification",
          path: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
          link: "https://krishnabhandari01.com.np",
          tech: ["React.js", "Python", "FastAPI", "WebSockets", "SQLite"],
          description: "Live environmental dashboard streaming air quality indices (AQI), automatic purification thresholds, and instant fire/hazard alert triggers via WebSockets.",
        },
      ],
    },
    {
      images: [
        {
          title: "Smart Face Attendance",
          path: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80",
          link: "https://krishnabhandari01.com.np",
          tech: ["Python", "OpenCV", "FastAPI", "React.js", "SQLite"],
          description: "Automated facial recognition attendance logger tailored for schools and offices with high-accuracy identity verification and exportable logs.",
        },
        {
          title: "IoT GPS Bus Tracking",
          path: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
          link: "https://krishnabhandari01.com.np",
          tech: ["React.js", "Leaflet", "Node.js", "WebSockets"],
          description: "Real-time public transit tracking system featuring live map coordinate plotting, route ETA prediction, and active vehicle telemetry.",
        },
        {
          title: "Django E-Commerce API",
          path: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
          link: "https://krishnabhandari01.com.np",
          tech: ["Python", "Django REST", "MongoDB", "Celery"],
          description: "Multi-vendor store backend with async job processing (Celery), custom JWT authentication pipelines, and flexible document catalog storage.",
        },
      ],
    },
  ],
};

const WorkSlider = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const openModal = (project: ProjectData) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <Swiper
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        grabCursor={true}
        touchRatio={1.5}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Pagination, Autoplay]}
        className="h-[280px] sm:h-[480px]"
      >
        {workSlides.slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
              {slide.images.map((image, imageI) => (
                <div
                  className="relative rounded-lg overflow-hidden flex items-center justify-center group h-full w-full"
                  key={imageI}
                >
                  <div className="flex items-center justify-center relative overflow-hidden group w-full h-full">
                    <Image
                      src={image.path}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Dark Hover Overlay */}
                    <div
                      className="absolute inset-0 bg-black/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-4 text-center z-10"
                    >
                      <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">
                        {image.title}
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* Live Preview Button */}
                        <Link
                          href={image.link}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="bg-[#f13024] hover:bg-[#f13024]/80 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                        >
                          Live Preview
                          <BsArrowRight className="text-sm" />
                        </Link>
                        
                        {/* View Details Button */}
                        <button
                          onClick={() => openModal(image)}
                          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        project={selectedProject} 
      />
    </>
  );
};

export default WorkSlider;
