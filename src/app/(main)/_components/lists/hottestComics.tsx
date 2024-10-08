import Link from "next/link";
import Image from "next/image";

import { Genre } from "@/types";
import {
  HOTTEST_CONTENT_PAGE_SIZE,
  CONTENT_LIST_DEFAULT_PAGE_NUMBER,
} from "@/constants";
import ErrorMessage from "@/components/messages/errorMessage";
import { contentCoverBlurDataImageURL } from "@/data/imageDataUrls";

import numeral from "@/libs/numeral";
import getContentList, {
  ContentListResponse,
} from "@/libs/dbCRUD/getContentList";

import { AiFillLike } from "react-icons/ai";
import { FaEye } from "react-icons/fa";

const HottestComics: React.FC<{
  title: string;
  seeAll?: string;
}> = async ({ title, seeAll }) => {
  const hottestComicsListResponse: ContentListResponse = await getContentList(
    {
      sortBy: "hottest",
      populate: [
        { from: "Genres", localField: "genres", as: "genres", project: "name" },
      ],
    },
    CONTENT_LIST_DEFAULT_PAGE_NUMBER,
    HOTTEST_CONTENT_PAGE_SIZE,
  );

  const { error, errorMessage, contentList } = hottestComicsListResponse;

  return (
    <div className="mx-auto w-[90%] overflow-hidden md:mb-[30px] md:w-full">
      <div className="relative mx-auto my-5 w-full max-w-[1200px] overflow-hidden md:my-[30px]">
        <h2 className="w-[70%] truncate text-[22px] font-bold md:text-[28px]">
          {title}
        </h2>

        {seeAll && (
          <Link href={seeAll}>
            <span className="absolute right-2.5 top-2.5 text-sm text-[var(--app-text-color-red)] md:right-0 md:text-lg">
              See all &gt;
            </span>
          </Link>
        )}

        {error && (
          <ErrorMessage>{`Unable to load ${title} because ${errorMessage}`}</ErrorMessage>
        )}

        <div className="mx-auto my-2.5 w-full overflow-hidden lg:flex">
          {contentList.map((content, index) => (
            <Link
              key={content.id}
              href={`/${encodeURIComponent(content.title.toLocaleLowerCase().replaceAll(" ", "-"))}?content_id=${content.id}`}
            >
              <div className="mb-[2%] mr-[15px] box-border h-[190px] w-[150%] overflow-hidden bg-[url('/assets/hot-content-bg.png')] bg-[length:100%_100%] p-[2%] sm:h-[275px] lg:mb-0 lg:w-[590px] lg:p-[15px]">
                <div className="float-left h-full w-1/4 sm:h-[245px] md:w-[185px]">
                  <Image
                    placeholder="blur"
                    blurDataURL={contentCoverBlurDataImageURL}
                    src={content.poster}
                    alt={`content${index + 1}`}
                    height={250}
                    width={200}
                    className="h-full w-full rounded object-cover"
                  />
                </div>

                <div className="float-left ml-[3%] w-1/2 overflow-hidden md:m-[10px_30px_20px_17px] lg:w-[328px]">
                  <div className="h-[29px] w-[70%] truncate text-base leading-[29px] md:text-xl">
                    <span>{content.title}</span>
                  </div>

                  <div className="font-noto-sans-sc h-5 w-[80%] truncate text-sm/[20px] text-neutral-400">
                    {(content.genres as Genre[])
                      .map((genre) => genre.name)
                      .join(" / ")}
                  </div>

                  <div className="mt-2.5 flex h-5 w-full items-center text-[var(--app-text-color-crimson)]">
                    <FaEye className="mr-1 size-3.5" />
                    <span className="mr-[15px] inline-block text-xs text-neutral-400 md:text-base">
                      {numeral(content.noOfViews)}
                    </span>

                    <AiFillLike className="mr-1 size-3.5" />
                    <span className="text-xs text-neutral-400 md:text-base">
                      {numeral(content.noOfSubscribers)}
                    </span>
                  </div>

                  <div className="font-noto-sans-sc mt-5 line-clamp-4 w-[70%] text-xs/[18px] font-normal text-neutral-400 md:w-full md:text-sm">
                    {content.description}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HottestComics;
