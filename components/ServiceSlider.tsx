"use client";

import {
  RxCrop,
  RxPencil2,
  RxDesktop,
  RxReader,
  RxRocket,
  RxCode,
  RxArrowTopRight,
} from "react-icons/rx";
import type { IconType } from "react-icons";
import { FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const serviceData: {
  Icon: IconType;
  title: string;
  description: string;
}[] = [
  {
    Icon: RxDesktop,
    title: "Web Development",
    description: "Modern, responsive, and high-performance websites built to represent your business professionally and provide a smooth experience across desktop and mobile devices.",
  },
  {
    Icon: RxRocket,
    title: "Backend Development",
    description: "Secure and scalable backend systems designed to handle business logic, data processing, authentication, APIs, and real-world application requirements.",
  },
  {
    Icon: RxCrop,
    title: "Full-Stack Development",
    description: "Complete web applications built from frontend to backend, connecting intuitive user interfaces with reliable APIs and database systems.",
  },
  {
    Icon: RxPencil2,
    title: "Custom Software Development",
    description: "Business-specific software solutions designed around real workflows, helping organizations reduce manual work and manage their operations more efficiently.",
  },
  {
    Icon: RxReader,
    title: "Database Solutions",
    description: "Well-structured and reliable database solutions for applications that require secure data storage, efficient queries, relationships, and scalable data management.",
  },
  {
    Icon: RxCode,
    title: "API Development & Integration",
    description: "Clean and reliable APIs that allow applications, services, and platforms to communicate securely and efficiently.",
  },
];

const ServiceSlider = () => {
  return (
    <Swiper
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 15,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
      }}
      pagination={{
        clickable: true,
      }}
      grabCursor={true}
      touchRatio={1.5}
      modules={[FreeMode, Pagination]}
      freeMode
      className="h-[340px] sm:h-[400px]"
    >
      {serviceData.map((item, i) => (
        <SwiperSlide key={i} className="h-full">
          <div className="bg-[rgba(65,47,123,0.15)] h-full min-h-[max-content] sm:min-h-[300px] rounded-lg px-5 sm:px-6 py-6 sm:py-8 flex flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,65,169,0.15)] transition-all duration-300">
            <div className="text-4xl text-accent mb-3 sm:mb-4">
              <item.Icon aria-hidden />
            </div>

            <div className="mb-4 sm:mb-8 flex-1">
              <div className="mb-2 text-lg">{item.title}</div>
              <p className="max-w-87.5 leading-normal text-sm sm:text-base">{item.description}</p>
            </div>

            <div className="text-3xl mt-auto">
              <RxArrowTopRight
                className="group-hover:rotate-45 group-hover:text-accent transition-all duration-300"
                aria-hidden
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ServiceSlider;
