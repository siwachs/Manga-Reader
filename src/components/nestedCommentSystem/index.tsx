"use client";

import React, { useState } from "react";
import Image from "next/image";

import { formatDistanceToNow, parseISO } from "date-fns";
import { roboto } from "@/libs/fonts";
import { Comment as CommentType } from "@/types";

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

  return (
    <div
      className={`${roboto.className} text-[var(--app-text-color-dark-grayish-green)]`}
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
            {commentsPayload.comments?.length ?? 0} Comments
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
          <div className="mb-3 flex items-center gap-2.5 p-[7px_14px]">
            <FaRegHeart className="4" />

            <span className="text-xs/[18px] font-bold">0</span>
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

    return (
      <div className="my-4">
        <div className="header flex flex-wrap">
          {/* Avatar */}
          <div
            className={`avatar mb-[9px] mr-2.5 ${isChildrenCollapsed ? "size-10" : "size-[52px]"} flex-shrink-0 rounded-2xl`}
          >
            <Image
              src={comment.user.avatar}
              alt={comment.user.username ?? "profile-pic"}
              width={60}
              height={60}
              className="h-full w-full rounded-[inherit] object-cover object-center"
            />
          </div>

          {/* Username and Timestamp */}
          <div className="mt-1 flex-1">
            <div className="pr-[15px] text-[15px]/[18px] font-bold">
              <span>{comment.user.username ?? "Invalid username"}</span>
              <HiUserAdd
                className="ml-1.5 inline-block size-4 text-[var(--app-text-color-cool-tone-grayish-blue)] opacity-60 hover:opacity-100"
                tabIndex={0}
                role="button"
                aria-label="Add user"
                onClick={() => {}}
              />
            </div>

            <span className="text-xs/[21px] font-medium text-[var(--app-text-color-muted-blue-gray)]">
              <span>{timeAgo}</span>
              {comment.isEdited && <span className="ml-3">edited</span>}
            </span>
          </div>

          {/* Flag and collapse */}
          <div className="flex gap-2.5 p-[0_6px_12px_10px] text-[var(--app-text-color-cool-tone-grayish-blue)]">
            {isChildrenCollapsed ? (
              <FaPlus
                className="size-4 opacity-60 hover:opacity-100"
                tabIndex={0}
                role="button"
                aria-label="Expand Children"
                onClick={() => setIsChildrenCollapsed(false)}
              />
            ) : (
              <FaMinus
                className="size-[18px] opacity-60 hover:opacity-100"
                tabIndex={0}
                role="button"
                aria-label="Collapse Children"
                onClick={() => setIsChildrenCollapsed(true)}
              />
            )}

            <TiFlag
              className="mt-0.5 size-4 opacity-60 hover:opacity-100"
              tabIndex={0}
              role="button"
              aria-label="Flag Comment"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Message */}
        <p
          className={`${isChildrenCollapsed ? "hidden" : ""} break-words text-[15px] leading-[21px] ${comment.isDeleted ? "line-through" : "whitespace-pre-wrap"}`}
          dangerouslySetInnerHTML={{
            __html: comment.isDeleted
              ? "This message has been deleted."
              : comment.message,
          }}
        />

        {/* Votes, Edit and Delete Comment */}
        <div className="footer mt-2 flex min-h-[26px] flex-wrap items-center text-xs font-medium text-[var(--app-text-color-dark-grayish-green)]">
          <button
            onClick={() =>
              !comment.isDeleted &&
              voteComment({ userId, contentId, chapterId }, comment.id, "up")
            }
            className="flex items-center"
            aria-label={
              comment?.voteType === "up" ? "Remove Upvote" : "Upvote Comment"
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
            onClick={() =>
              !comment.isDeleted &&
              voteComment({ userId, contentId, chapterId }, comment.id, "down")
            }
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

          <button
            onClick={() => setIsReplying((prev) => !prev)}
            className="mx-3.5 text-sm"
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
                    ) && deleteComment({ "x-user-id": userId }, comment.id)
              }
              className={`mx-1.5 text-sm ${comment.isDeleted ? "text-[var(--app-text-color-medium-dark-blue)]" : "text-red-600"}`}
              aria-label={comment.isDeleted ? "Unde Delete" : "Delete Comment"}
            >
              {comment.isDeleted ? "Undo" : <FaTrash />}
            </button>
          )}
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

        {/* Render Child Comments */}
        {childComments.length > 0 && (
          <div
            className={`${isChildrenCollapsed ? "hidden" : ""} border-l-2 border-[var(--app-border-color-periwinkle)] pl-6`}
          >
            <CommentList comments={childComments} />
          </div>
        )}
      </div>
    );
  },
);

Comment.displayName = "Comment";

export default NestedCommentSystem;
