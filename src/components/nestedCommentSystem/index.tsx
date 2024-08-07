"use client";

import "./index.css";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { formatDistanceToNow, parseISO } from "date-fns";
import { roboto } from "@/libs/fonts";
import { Comment as CommentType, VoteType } from "@/types";

import {
  NestedCommentProvider,
  useNestedCommentSystem,
} from "@/contexts/nestedCommentContext";
import CommentForm from "./commentForm";
import ClientAuth from "../buttons/clientAuth";

import { HiUserAdd } from "react-icons/hi";
import { IoChatbubble } from "react-icons/io5";
import { FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { TiFlag } from "react-icons/ti";
import { IoMdShareAlt } from "react-icons/io";

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

const sortButtonClasses =
  "text-sm/[19px] font-semibold data-[active=true]:border-b-[3px] data-[active=true]:border-[var(--app-text-color-gunmelt-gray)]";

const NestedCommentsContainer: React.FC = () => {
  const {
    rootComments,
    commentsPayload,
    changeCommentsOrder,
    loadMoreComments,
  } = useNestedCommentSystem();

  function renderComments() {
    if (commentsPayload.loading)
      return (
        <div className="h-[107px] bg-[url('/assets/loading-gear.gif')] bg-center bg-no-repeat" />
      );

    if (commentsPayload.error)
      return (
        <div className="flex min-h-[107px] items-center justify-center leading-7 text-red-600">
          {commentsPayload.errorMessage}
        </div>
      );

    if (rootComments.length === 0)
      return (
        <div className="text-center leading-[107px] opacity-60">
          Be the first to comment.
        </div>
      );

    return <CommentList comments={rootComments} />;
  }

  // 540px

  // Line height -> line height go smaller as text size increase use 1.1 or 1.3x of font size
  // Letter Space -> -1 to -2%, -0.5% for headings
  // 50 - 75 chars for a p use 600px width for a desktop screen

  // sm:w-[calc(100%-6rem)] md:w-[calc(100%-8rem)]

  return (
    <div
      className={`${roboto.className} nested-comment-system-wrapper text-[var(--app-text-color-dark-grayish-green)]`}
    >
      <header className="mb-6">
        <div className="flex items-center justify-between border-b-2 border-[var(--app-border-color-slightly-blue-gray)] py-3 font-bold">
          <span
            className={
              commentsPayload.loading
                ? "animate-pulse rounded-sm bg-gray-400 text-gray-400"
                : undefined
            }
          >
            {commentsPayload.totalComments} Comments
          </span>

          <ClientAuth
            profileContainerClasses="relative size-9"
            profileMenuPositionClasses="right-0 top-10"
            signInButtonClasses="flex items-center gap-1.5"
            signInButtonComponent={
              <>
                <div className="relative">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white">
                    1
                  </span>
                  <IoChatbubble className="size-[22px]" />
                </div>

                <span>Sign In</span>
              </>
            }
          />
        </div>
      </header>

      <section>
        <CommentForm />

        <div className="mb-2 flex items-center justify-between">
          <div className="mb-3 ml-3 flex items-center gap-2.5">
            <FaRegHeart />

            <span className="text-xs/[18px] font-bold">6</span>
          </div>

          <div className="mb-3 flex items-center gap-4 pt-[3px]">
            <button
              type="button"
              onClick={() => changeCommentsOrder("BEST")}
              data-active={commentsPayload.sortKey === "BEST"}
              className={sortButtonClasses}
            >
              Best
            </button>

            <button
              type="button"
              onClick={() => changeCommentsOrder("NEWEST")}
              data-active={commentsPayload.sortKey === "NEWEST"}
              className={sortButtonClasses}
            >
              Newest
            </button>

            <button
              type="button"
              onClick={() => changeCommentsOrder("OLDEST")}
              data-active={commentsPayload.sortKey === "OLDEST"}
              className={sortButtonClasses}
            >
              Oldest
            </button>
          </div>
        </div>

        {renderComments()}

        {commentsPayload.pageNumber !== commentsPayload.totalPages && (
          <button
            type="button"
            onClick={() => loadMoreComments(commentsPayload.pageNumber + 1)}
            disabled={
              commentsPayload.loading || commentsPayload.loadMoreCommentsLoding
            }
            className="my-1.5 w-full rounded-[15px] border border-[var(--app-text-color-gunmelt-gray)] pb-[8px] pt-[9px] text-center text-lg/[21px] font-bold text-[var(--app-text-color-gunmelt-gray)] transition-all duration-200 hover:bg-[var(--app-text-color-gunmelt-gray)] hover:text-white disabled:pointer-events-none"
          >
            Load more comments
          </button>
        )}

        <div className="mb-5 border border-[#dcdde7]" />
      </section>
    </div>
  );
};

const CommentList: React.FC<{ comments: CommentType[] }> = ({ comments }) => {
  return comments.map((comment: any) => (
    <Comment key={comment.id} comment={comment} />
  ));
};

const Comment: React.FC<{ comment: CommentType }> = React.memo(
  ({ comment }) => {
    const {
      getReplies,
      voteComment,
      deleteComment,
      userId,
      contentId,
      chapterId,
    } = useNestedCommentSystem();

    const [isChildrenCollapsed, setIsChildrenCollapsed] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const parsedDate = parseISO(comment.createdAt);
    const timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });

    const childComments = getReplies(comment.id);

    const onClickVoteComment = (voteType: VoteType) => {
      if (comment.isDeleted) return;

      voteComment({ userId, contentId, chapterId }, comment.id, voteType);
    };

    return (
      <div id={comment.id}>
        <div className="mb-4 flex flex-wrap">
          <div
            data-role="avatar-container"
            className={`relative mb-[9px] mr-2.5 ${isChildrenCollapsed ? "size-10" : "size-[52px]"} flex-shrink-0 rounded-2xl`}
          >
            <div
              className={`absolute left-0 top-0 hidden ${isChildrenCollapsed ? "h-10" : "h-[52px]"} w-[5px] rounded-[3px] bg-[var(--app-text-color-gunmelt-gray)]`}
            />
            <Image // ml-3
              src={comment.user?.avatar ?? "/assets/person.png"}
              alt={comment.user?.username ?? "profile-pic"}
              width={60}
              height={60}
              className="h-full w-full rounded-[inherit] object-cover object-center"
            />
          </div>

          <div data-role="body-container" className="flex-1">
            <div
              data-role="username-timestamp-collapse-and-flag-container"
              className="my-1 flex min-h-5 flex-wrap"
            >
              <div
                data-role="username-timestamp"
                className="mr-3 flex-1 text-xs/[21px]"
              >
                <div className="flex flex-wrap items-center">
                  <span className="mr-1 line-clamp-1 text-[15px] font-bold text-[var(--app-text-color-gunmelt-gray)]">
                    {comment.user?.username ?? "deleted"}
                    &nbsp;
                    <HiUserAdd
                      className="-mt-1 inline-block size-[18px] text-[var(--app-text-color-blue-gray)] hover:text-[var(--app-text-color-gunmelt-gray)]"
                      tabIndex={0}
                      role="button"
                      aria-label="Add user"
                      onClick={() => {}}
                    />
                  </span>

                  {comment.parentId !== "root" && (
                    <Link
                      href={`#${comment.parentId}`}
                      className="ml-2 select-none font-medium text-[var(--app-text-color-very-dary-steel-blue)]"
                    >
                      <IoMdShareAlt className="inline-block size-4" />
                      &nbsp;
                      {comment.user?.username ?? "deleted"}
                    </Link>
                  )}
                </div>

                <span className="font-medium text-[var(--app-text-color-very-dary-steel-blue)]">
                  <span>{timeAgo}</span>
                  {comment.isEdited && <span className="ml-3">edited</span>}
                </span>
              </div>

              <div
                data-role="collapse-and-flag"
                className="mr-4 flex text-[var(--app-text-color-blue-gray)]"
              >
                {isChildrenCollapsed ? (
                  <FaPlus
                    className="mr-2.5 size-4 hover:text-[var(--app-text-color-gunmelt-gray)]"
                    tabIndex={0}
                    role="button"
                    aria-label="Expand Children"
                    onClick={() => setIsChildrenCollapsed(false)}
                  />
                ) : (
                  <FaMinus
                    className="mr-2.5 size-[18px] hover:text-[var(--app-text-color-gunmelt-gray)]"
                    tabIndex={0}
                    role="button"
                    aria-label="Collapse Children"
                    onClick={() => setIsChildrenCollapsed(true)}
                  />
                )}

                <TiFlag
                  className="mt-0.5 size-4 hover:text-[var(--app-text-color-gunmelt-gray)]"
                  tabIndex={0}
                  role="button"
                  aria-label="Flag Comment"
                  onClick={() => {}}
                />
              </div>
            </div>

            <div
              data-role="message-votes-reply-edit-and-delete"
              className={
                isChildrenCollapsed ? "hidden" : "-ml-[62px] mt-4 sm:ml-0"
              }
            >
              <p
                className={`break-words text-[15px] leading-[21px] ${comment.isDeleted ? "line-through" : "whitespace-pre-wrap"}`}
                dangerouslySetInnerHTML={{
                  __html: comment.isDeleted
                    ? "This comment was deleted."
                    : comment.message,
                }}
              />

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--app-text-color-dark-grayish-green)]">
                <div className="flex flex-wrap items-center">
                  <button
                    onClick={() => onClickVoteComment("up")}
                    className="flex items-center"
                    aria-label={
                      comment?.voteType === "up"
                        ? "Remove Upvote"
                        : "Upvote Comment"
                    }
                  >
                    {comment?.voteType === "up" ? (
                      <BiSolidLike className="mx-2 size-5 text-[var(--app-text-color-red)]" />
                    ) : (
                      <BiLike className="mx-2 size-5 text-[var(--app-text-color-cool-tone-grayish-blue)]" />
                    )}

                    <span>{comment.upVotes}</span>
                  </button>

                  <button
                    onClick={() => onClickVoteComment("down")}
                    className="flex items-center"
                    aria-label={
                      comment?.voteType === "down"
                        ? "Remove Downvote"
                        : "Downvote Comment"
                    }
                  >
                    {comment?.voteType === "down" ? (
                      <BiSolidDislike className="mx-2 size-5 text-[var(--app-text-color-red)]" />
                    ) : (
                      <BiDislike className="mx-2 size-5 text-[var(--app-text-color-cool-tone-grayish-blue)]" />
                    )}
                    <span>{comment.downVotes}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center">
                  <button
                    onClick={() => setIsReplying((prev) => !prev)}
                    className="ml-2 mr-3.5 text-sm"
                  >
                    Reply
                  </button>

                  {!comment.isDeleted && comment.user.id === userId && (
                    <FaEdit
                      className="mx-1.5 text-sm"
                      tabIndex={0}
                      role="button"
                      aria-label="Edit Comment"
                      onClick={() => {
                        setIsEditing((prev) => !prev);
                      }}
                    />
                  )}

                  {comment.user.id === userId && (
                    <button
                      onClick={() =>
                        comment.isDeleted
                          ? deleteComment({ "x-user-id": userId }, comment.id)
                          : confirm(
                              "You cannot delete a comment. You can only hide it.",
                            ) &&
                            deleteComment({ "x-user-id": userId }, comment.id)
                      }
                      className={`mx-1.5 text-sm ${comment.isDeleted ? "text-[var(--app-text-color-medium-dark-blue)]" : "text-red-600"}`}
                      aria-label={
                        comment.isDeleted ? "Unde Delete" : "Delete Comment"
                      }
                    >
                      {comment.isDeleted ? "Undo" : <FaTrash />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isReplying && (
          <CommentForm
            parentId={comment.id}
            callback={() => setIsReplying(false)}
          />
        )}

        {isEditing && (
          <CommentForm
            initialMessage={comment.message}
            commentId={comment.id}
            editMode
            callback={() => setIsEditing(false)}
          />
        )}

        {childComments.length > 0 && (
          <div
            className={`${isChildrenCollapsed ? "hidden" : ""} border-l-2 border-[var(--app-border-color-periwinkle)] pl-[14px] sm:pl-[62px]`}
          >
            <CommentList comments={childComments} />
          </div>
        )}
      </div>
    );
  },
);

const CommentBodyContainer = () => {};

Comment.displayName = "Comment";

export default NestedCommentSystem;
