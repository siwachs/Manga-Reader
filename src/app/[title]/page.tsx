import React from "react";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Like, StarSolid, View } from "@/components/icons";
import EditRating from "@/app/[title]/_components/editRating";
import DetailDescription from "./_components/detailDescription";
import ChaptersAndComments from "./_components/chaptersAndComments";

const data = {
  thumbnail: "/dummyContent/thumbnail.webp",
  poster: "/dummyContent/3.webp",
  title: "The Beginner's Guide to Be A Princess",
  status: "on going",
  genres: [
    "Shonen",
    "Shojo",
    "Seinen",
    "Josei",
    "Isekai",
    "Slice of Life",
    "Fantasy",
    "Sci-Fi",
    "Horror",
    "Mystery",
    "Romance",
    "Action",
  ],
  noOfViews: "6.2M",
  numberOfLikes: "345k",
  rating: 4.5,
  authonName: "Xiaomingtaiji",
  description: `All the infant girls countrywide drift downstream from the beginning of the fosse. Whoever reaches the terminal point first will be adopted by the emperor.
  Excuse me??? Who think of such ridiculous idea?! Whoa! I want to go back to my original world!
  What an awful time travel!
  MangaToon got authorization from Xiaomingtaiji to publish this work, the content is the author's own point of view, and does not represent the stand of MangaToon.`,
};

export const metadata: Metadata = {
  title: `${data.title} - Manga Reader`,
  description: data.description,
};

export default function TitlePage() {
  return (
    <div className="details-wrapper mx-[5%] w-[90%] max-w-[1200px] pt-[5%] lg:mx-auto lg:w-full lg:pt-[45px]">
      <div className="details-top-info mx-[1px] mb-[1px] h-[27%] w-full overflow-visible lg:h-[345px] lg:overflow-hidden">
        <div className="detail-image relative h-[54.5vw] w-full sm:h-[345px] sm:w-[260px] lg:mr-[45px] lg:inline-block">
          <picture>
            <source media="(min-width: 640px)" srcSet={data.poster} />
            <Image
              height={700}
              width={600}
              src={data.thumbnail}
              alt={data.title}
              className="h-full w-full rounded object-cover object-center"
            />
          </picture>
        </div>

        <div className="detail-info hidden-scrollbar w-full overflow-hidden lg:inline-block lg:h-[345px] lg:w-[880px] lg:overflow-auto">
          <div className="detail-title flex overflow-hidden py-2.5 lg:mb-[4px] lg:h-[29px] lg:py-0">
            <span className="hide-text font-noto-sans-sc mr-[80px] w-full text-lg/[24px] font-[500] lg:mr-[15px] lg:h-[29px] lg:w-auto lg:text-xl/[29px]">
              {data.title}
            </span>

            <div className="absolute right-[5%] box-content h-[18px] whitespace-nowrap rounded-xl bg-[var(--app-text-color-red-orange)] px-[9px] pb-[3px] pt-[2px] text-center text-xs/[18px] text-white lg:static lg:h-5 lg:text-sm">
              {data.status}
            </div>
          </div>

          <div className="detail-genres font-noto-sans-sc hidden-scrollbar mb-[5px] h-5 overflow-auto whitespace-nowrap text-xs/[20px] font-normal text-[var(--app-text-color-darker-gray)] lg:mb-[15px] lg:max-w-[700px] lg:text-sm lg:text-[var(--app-text-color-slate-gray)]">
            {data.genres.map((genre, index) => (
              <React.Fragment key={genre}>
                <Link href={"/"} key={genre}>
                  {genre}
                </Link>
                {index + 1 !== data.genres.length && " / "}
              </React.Fragment>
            ))}
          </div>

          <div className="detail-stats flex items-center text-[13px] text-[var(--app-text-color-darker-gray)] lg:text-base">
            <View className="-mt-0.5 mr-0.5 h-[13px] w-[13px] lg:mr-1 lg:h-[18px] lg:w-[18px]" />
            <span>{data.noOfViews}</span>

            <Like className="-mt-0.5 ml-2.5 mr-0.5 h-[14px] w-[14px] lg:ml-[25px] lg:mr-1 lg:h-[22px] lg:w-[22px]" />
            <span>{data.numberOfLikes}</span>

            <div className="-mt-0.5 ml-2.5 flex items-center">
              {[...new Array(5)].map((star, index) => {
                const uniqueKey = `star${index}`;
                const inverse = Math.floor(data.rating) <= index;
                return (
                  <StarSolid
                    key={uniqueKey}
                    inverse={inverse}
                    className="h-[17px] w-[17px] lg:mr-[3px] lg:h-5 lg:w-5"
                  />
                );
              })}

              <span className="-mb-[1px] ml-[4px] mt-[1px] text-sm lg:text-lg">
                {data.rating}
              </span>
              <EditRating />
            </div>
          </div>

          <div className="detail-author font-noto-sans-sc mt-[5px] text-xs/[20px] font-normal text-[var(--app-text-color-standard-gray)] lg:mt-2.5 lg:text-base">
            <span>{`Author Name: ${data.authonName}`}</span>
          </div>

          <DetailDescription description={data.description} />
        </div>
      </div>

      <ChaptersAndComments />
    </div>
  );
}
