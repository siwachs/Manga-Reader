"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { formatDistanceToNow, parseISO } from "date-fns";
import { roboto } from "@/libs/fonts";
import { Comment as CommentType } from "@/types";

import {
  NestedCommentProvider,
  useNestedCommentSystem,
} from "@/contexts/nestedCommentContext";
import {
  AddUser,
  ChatBubbleSolid,
  DislikeOutline,
  Flag,
  HeartOutline,
  LikeOutline,
  Minus,
} from "../icons";
import CommentForm from "./commentForm";

const sortButtonClasses =
  "text-sm/[19px] font-semibold data-[active=true]:border-b-[3px] data-[active=true]:border-[var(--app-text-color-gunmelt-gray)]";

const NestedCommentSystem: React.FC<{
  contentId: string;
  chapterId?: string;
}> = ({ contentId, chapterId }) => {
  return (
    <NestedCommentProvider contentId={contentId} chapterId={chapterId}>
      <NestedCommentsContainer />
    </NestedCommentProvider>
  );
};

const NestedCommentsContainer: React.FC = () => {
  const { rootComments, commentsPayload, changeCommentsOrder } =
    useNestedCommentSystem();

  return (
    <div
      className={`${roboto.className} text-[var(--app-text-color-dark-grayish-green)]`}
    >
      <header className="mb-6">
        <div className="flex justify-between border-b-2 border-[var(--app-border-color-slightly-blue-gray)] py-3 font-bold">
          <span>31 Comments</span>

          <Link href="/" className="flex items-center gap-1.5">
            <div className="relative">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white">
                1
              </span>
              <ChatBubbleSolid className="size-[22px]" />
            </div>
            <span>Sign In</span>
          </Link>
        </div>
      </header>

      <section>
        <CommentForm />
        <div className="mb-2 flex items-center justify-between">
          <div className="mb-3 flex items-center gap-2.5 p-[7px_14px]">
            <button>
              <HeartOutline className="size-4" />
            </button>
            <span className="text-xs/[18px] font-bold">7</span>
          </div>

          <div className="mb-3 flex items-center gap-4 pt-[3px]">
            <button
              onClick={() => changeCommentsOrder("BEST")}
              data-active={commentsPayload.sortKey === "BEST"}
              className={sortButtonClasses}
            >
              Best
            </button>
            <button
              onClick={() => changeCommentsOrder("NEWEST")}
              data-active={commentsPayload.sortKey === "NEWEST"}
              className={sortButtonClasses}
            >
              Newest
            </button>
            <button
              onClick={() => changeCommentsOrder("OLDEST")}
              data-active={commentsPayload.sortKey === "OLDEST"}
              className={sortButtonClasses}
            >
              Oldest
            </button>
          </div>
        </div>

        {commentsPayload.loading ? (
          <div className="h-[107px] bg-[url('/assets/loading-gear.gif')] bg-center bg-no-repeat" />
        ) : rootComments.length > 0 ? (
          <CommentList comments={rootComments} />
        ) : (
          <div className="text-center leading-[107px] opacity-60">
            Be the first to comment.
          </div>
        )}
      </section>
    </div>
  );
};

const CommentList: React.FC<{ comments: CommentType[] }> = ({ comments }) => {
  return comments.map((comment: any) => (
    <div key={comment.id} className="mb-4">
      <Comment comment={comment} />
    </div>
  ));
};

const Comment: React.FC<{ comment: CommentType }> = ({ comment }) => {
  const { getReplies } = useNestedCommentSystem();
  const [isReplying, setIsReplying] = useState(false);
  const parsedDate = parseISO(comment.createdAt);
  const timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });

  const childComments = getReplies(comment.id);

  return (
    <div>
      <div className="header flex">
        <div className="avatar mb-[9px] mr-2.5 h-[52px] w-[52px] rounded-2xl">
          <Image
            src={comment.user.avatar}
            alt={comment.user.username ?? "Invalid username"}
            width={60}
            height={60}
            className="h-full w-full rounded-[inherit] object-cover object-center"
          />
        </div>

        <div className="mt-1">
          <div className="truncate text-[15px]/[18px] font-bold">
            {comment.user.username ?? "Invalid username"}
            <AddUser className="ml-1.5 inline-block size-4 text-[var(--app-text-color-cool-tone-grayish-blue)]" />
          </div>

          <span className="text-xs/[21px] font-medium text-[var(--app-text-color-muted-blue-gray)]">
            <span>{timeAgo}</span>
            {comment.isEdited && <span className="ml-3">edited</span>}
          </span>
        </div>

        <div className="mb-2.5 ml-auto mr-3 flex gap-2.5 text-[var(--app-text-color-muted-blue-gray)]">
          <Minus className="size-[18px] opacity-60" />
          <Flag className="mt-0.5 size-3 opacity-60" />
        </div>
      </div>

      <p className="body break-words text-[15px] leading-[21px]">
        {comment.message}
      </p>

      <div className="footer mt-1.5 flex h-[2em] items-center text-xs font-medium text-[var(--app-text-color-dark-grayish-green)]">
        <button className="flex items-center">
          <LikeOutline className="mx-2 size-5 text-[var(--app-text-color-cool-tone-grayish-blue)]" />
          <span>{comment.upVotes}</span>
        </button>

        <button className="flex items-center">
          <DislikeOutline className="mx-2 size-5 text-[var(--app-text-color-cool-tone-grayish-blue)]" />
          <span>{comment.downVotes}</span>
        </button>

        <button
          onClick={() => setIsReplying((prev) => !prev)}
          className="mx-3.5 text-sm"
        >
          Reply
        </button>
      </div>

      {isReplying && (
        <CommentForm
          parentId={comment.id}
          callback={() => setIsReplying(false)}
        />
      )}

      {/* Child comments recursive */}
      {childComments.length > 0 && (
        <div className="border-l-2 border-[var(--app-border-color-periwinkle)] pl-3.5">
          <CommentList comments={childComments} />
        </div>
      )}
    </div>
  );
};

export default NestedCommentSystem;
