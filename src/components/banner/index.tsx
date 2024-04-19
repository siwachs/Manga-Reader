"use client";

import { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import "./slider.css";
import { ChevronLeft, ChevronRight } from "../icons";

const images = [
  "https://cn-e-pic.mangatoon.mobi/pictures_library/7d7ed86c8b538179dc2c34bbdb9db293.webp",
  "https://cn-e-pic.mangatoon.mobi/pictures_library/eb3020e566a07d35c3706fffdc91af9e.webp",
  "https://cn-e-pic.mangatoon.mobi/pictures_library/3f8020acc1e714ef663b62360b152a8c.webp",
  "https://cn-e-pic.mangatoon.mobi/pictures_library/733d91eb4b61387e718e2531068d2398.webp",
  "https://cn-e-pic.mangatoon.mobi/pictures_library/7f865446a25ca4c75d9e825d0b3e1910.webp",
  "https://cn-e-pic.mangatoon.mobi/homepage-banners/562-2763.webp",
];

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(2);

  const getImageClass = (index: number): string => {
    if (index === currentSlide) return "centerActive";

    const slideIndex =
      currentSlide - 1 < 0 ? images.length - 1 : currentSlide - 1;
    if (slideIndex === index) return "leftActive";

    if ((currentSlide + 1) % images.length === index) return "rightActive";

    return "imageHidden";
  };

  const activateSlide = (index: number): void => {
    if (index === currentSlide) return;

    setCurrentSlide(index);
  };

  return (
    <div className="banner mx-auto mt-5 w-[90%] overflow-hidden lg:m-0 lg:w-full">
      <div className="banner-images relative mx-auto w-full max-w-[1200px] lg:my-[30px]">
        <div className="slide relative h-[60vw] w-full overflow-hidden lg:h-[432px]">
          {images.map((image, index) => (
            <Link
              key={image}
              href={`${"Your Turn to Chase After Me".toLocaleLowerCase().replaceAll(" ", "-")}?content_id=1753528`}
              onClick={() => activateSlide(index)}
            >
              <div
                className={`img absolute overflow-hidden ${getImageClass(index)}`}
              >
                <Image
                  src={image}
                  alt={`slide-${index}`}
                  width={800}
                  height={432}
                  className="mx-[7px] rounded"
                />
              </div>
            </Link>
          ))}

          <div className="absolute bottom-0 z-30 flex w-full justify-center">
            {images.map((image, index) => (
              <button
                key={image}
                className={`m-[5px] h-[9px] rounded ${currentSlide === index ? "w-[25px] bg-[var(--app-text-color-red)]" : "w-[9px] cursor-pointer bg-[var(--app-text-color-light-gray)]"}`}
                onClick={() => activateSlide(index)}
              />
            ))}
          </div>
        </div>

        <ChevronLeft
          onClick={() =>
            setCurrentSlide((prev) => {
              if (prev - 1 < 0) return images.length - 1;

              return prev - 1;
            })
          }
          className="absolute -left-[150px] top-1/2 z-20 h-[100px] w-[100px] -translate-y-1/2 cursor-pointer text-[var(--app-text-color-silver-gray)] ring-black focus:outline-none focus-visible:ring-2"
        />
        <ChevronRight
          onClick={() => setCurrentSlide((prev) => (prev + 1) % images.length)}
          className="absolute -right-[150px] top-1/2 z-20 h-[100px] w-[100px] -translate-y-1/2 cursor-pointer text-[var(--app-text-color-silver-gray)] ring-black focus:outline-none focus-visible:ring-2"
        />
      </div>
    </div>
  );
};

export default Banner;
