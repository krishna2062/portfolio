"use client";

import { useEffect, useState } from "react";
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

import { api, PublicService, resolveImageUrl } from "@/lib/api";

const iconMap: Record<string, IconType> = {
  RxDesktop,
  RxRocket,
  RxCrop,
  RxPencil2,
  RxReader,
  RxCode,
};

const initialServiceData = [
  {
    iconKey: "RxDesktop",
    title: "Web Development",
    description: "Modern, responsive, and high-performance websites built to represent your business professionally and provide a smooth experience across desktop and mobile devices.",
  },
  {
    iconKey: "RxRocket",
    title: "Backend Development",
    description: "Secure and scalable backend systems designed to handle business logic, data processing, authentication, APIs, and real-world application requirements.",
  },
  {
    iconKey: "RxCrop",
    title: "Full-Stack Development",
    description: "Complete web applications built from frontend to backend, connecting intuitive user interfaces with reliable APIs and database systems.",
  },
  {
    iconKey: "RxPencil2",
    title: "Custom Software Development",
    description: "Business-specific software solutions designed around real workflows, helping organizations reduce manual work and manage their operations more efficiently.",
  },
  {
    iconKey: "RxReader",
    title: "Database Solutions",
    description: "Well-structured and reliable database solutions for applications that require secure data storage, efficient queries, relationships, and scalable data management.",
  },
  {
    iconKey: "RxCode",
    title: "API Development & Integration",
    description: "Clean and reliable APIs that allow applications, services, and platforms to communicate securely and efficiently.",
  },
];

const ServiceSlider = () => {
  const [services, setServices] = useState<{ iconKey: string; title: string; description: string }[]>(initialServiceData);

  useEffect(() => {
    api.getServices().then((data) => {
      if (data && data.length > 0) {
        setServices(data);
      }
    });
  }, []);

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
      {services.map((item, i) => {
        const IconComponent = iconMap[item.iconKey] || RxDesktop;
        const isCustomImage =
          item.iconKey?.startsWith("http://") ||
          item.iconKey?.startsWith("https://") ||
          item.iconKey?.startsWith("/") ||
          item.iconKey?.startsWith("data:");

        return (
          <SwiperSlide key={i} className="h-full">
            <div className="bg-[rgba(65,47,123,0.15)] h-full min-h-[max-content] sm:min-h-[300px] rounded-lg px-5 sm:px-6 py-6 sm:py-8 flex flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,65,169,0.15)] transition-all duration-300">
              <div className="text-4xl text-accent mb-3 sm:mb-4 flex items-center">
                {isCustomImage ? (
                  <img
                    src={resolveImageUrl(item.iconKey)}
                    alt={item.title}
                    className="w-10 h-10 object-contain text-accent filter drop-shadow"
                  />
                ) : (
                  <IconComponent aria-hidden />
                )}
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
        );
      })}
    </Swiper>
  );
};

export default ServiceSlider;
