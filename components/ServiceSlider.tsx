"use client";

import {
  RxCrop,
  RxPencil2,
  RxDesktop,
  RxReader,
  RxRocket,
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
    title: "Full Stack Web Development",
    description: "End-to-end React SPA frontend with scalable C# / ASP.NET Core backends.",
  },
  {
    Icon: RxRocket,
    title: "Backend Systems & REST APIs",
    description: "Secure authentication, RBAC, high-speed API performance, and micro-interactions.",
  },
  {
    Icon: RxPencil2,
    title: "Frontend & UI Engineering",
    description: "Fluid, responsive, and animated user interfaces with Tailwind and Framer Motion.",
  },
  {
    Icon: RxReader,
    title: "Database Design & IoT Telemetry",
    description: "Relational/NoSQL data schemas and sub-second live sensor feeds via WebSockets.",
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
          <div className="bg-[rgba(65,47,123,0.15)] h-full min-h-[300px] rounded-lg px-6 py-8 flex flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,65,169,0.15)] transition-all duration-300">
            <div className="text-4xl text-accent mb-4">
              <item.Icon aria-hidden />
            </div>

            <div className="mb-8 flex-1">
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
