import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import useBodyOverflow from "@/hooks/useBodyOverflow";

import { Chapter } from "@/types";
import { ChaptersOrder as ChaptersOrderType, ChaptersPayload } from "..";
import ModelOverlay from "@/components/utils/modelOverlay";
import ChaptersOrder from "../chaptersOrder";
import ChapterLink from "@/components/buttons/chapterLink";

import { CHAPTERS_LIST_DEFAULT_PAGE_SIZE } from "@/constants";

import { LiaTimesSolid } from "react-icons/lia";

const InfiniteScrollWithClientHeight: React.FC<{
  infiniteScroll: boolean;
  title: string;
  toogleInfiniteScroll: () => void;
  infiniteScrollToogleKeyDown?: (e: React.KeyboardEvent) => void;
  chaptersOrder: ChaptersOrderType;
  changeOrderToReverse: () => void;
  changeOrderToPositive: () => void;
  chapters: Chapter[];
  chaptersPayload: ChaptersPayload;
  setChaptersPayload: Dispatch<SetStateAction<ChaptersPayload>>;
  contentId: string;
}> = ({
  infiniteScroll,
  title,
  toogleInfiniteScroll,
  infiniteScrollToogleKeyDown,
  chaptersOrder,
  changeOrderToReverse,
  changeOrderToPositive,
  chapters,
  chaptersPayload,
  setChaptersPayload,
  contentId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      if (!container) return;

      const bottomOffset = container.scrollHeight - container.clientHeight;
      const scrolledToBottom = container.scrollTop >= bottomOffset * 0.9;
      const hasMore = chaptersPayload.pageNumber !== chaptersPayload.totalPages;

      if (scrolledToBottom && hasMore) {
        setChaptersPayload((prev) => {
          const startingIndex =
            (prev.pageNumber + 1) * CHAPTERS_LIST_DEFAULT_PAGE_SIZE;
          const endingIndex = startingIndex + CHAPTERS_LIST_DEFAULT_PAGE_SIZE;
          const nextChapters = chapters.slice(startingIndex, endingIndex);

          return {
            ...prev,
            chapters: [...prev.chapters, ...nextChapters],
            pageNumber: prev.pageNumber + 1,
          };
        });
      }
    };

    container?.addEventListener("scroll", handleScroll);

    return () => container?.removeEventListener("scroll", handleScroll);
  }, [
    chaptersPayload.pageNumber,
    chaptersPayload.totalPages,
    chaptersPayload.chapters,
    chapters,
  ]);

  useBodyOverflow(infiniteScroll);
  useOutsideClick(containerRef, infiniteScroll, toogleInfiniteScroll);

  return (
    <ModelOverlay blackBgHalfOpacity mobileOnly>
      <div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 h-[90vh] overflow-auto rounded-t-2xl bg-[var(--app-bg-color-primary)]"
      >
        <div className="fixed w-full rounded-t-2xl bg-[var(--app-bg-color-primary)]">
          <p className="m-4 text-center text-base font-medium">{title}</p>
          <LiaTimesSolid
            tabIndex={0}
            role="button"
            aria-label="Close Chapters List"
            onClick={toogleInfiniteScroll}
            onKeyDown={infiniteScrollToogleKeyDown}
            className="absolute right-4 top-4 size-5"
          />

          <div className="mt-2 flex items-center justify-between px-4 text-[13px]">
            <p>Update to chapters {chapters.length}</p>

            <ChaptersOrder
              mobileOnly
              order={chaptersOrder}
              changeOrderToReverse={changeOrderToReverse}
              changeOrderToPositive={changeOrderToPositive}
            />
          </div>
        </div>

        <div className="mb-10 mt-[100px]">
          {chaptersPayload.chapters.map((chapter) => (
            <ChapterLink
              key={chapter.id}
              title={chapter.title}
              releaseDate={chapter.createdAt}
              href={`/watch/${contentId}/${chapter.id}`}
            />
          ))}
        </div>
      </div>
    </ModelOverlay>
  );
};

export default InfiniteScrollWithClientHeight;
