export type pageReqObj = {
  params: { content_id?: string; chapter_id?: string };
  searchParams: {
    content_id?: string;
  };
};

export type LinkObject = {
  key: string;
  Icon?: any;
  sidebarOnly?: boolean;
  label: string;
  link: string;
};

export type Comment = {
  id: string;
  parentId: string;
  message: string;
  contentId: string;
  chapterId?: string;
  user: {
    id: string;
    username?: string;
    avatar: string;
  };
  upVotes: number;
  downVotes: number;
  isEdited: boolean;
  isReported: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  voteType?: VoteType;
};

export type SortKey = "BEST" | "NEWEST" | "OLDEST";

export type VoteType = "up" | "down";

export type CommentsPayload = {
  loading: boolean;
  error: boolean;
  errorMessage?: string;
  totalPages: number;
  totalComments: number;
  pageNumber: number;
  comments: Comment[];
  sortKey: SortKey;
  loadMoreCommentsLoding: boolean;
};
