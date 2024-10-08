import { SortOrder } from "mongoose";

import connectToMongoDB from "../db/connectToMongoDB";
import Genre from "@/models/Genre";
import Content from "@/models/Content";

import { Tags, Status, Content as ContentType } from "@/types";
import { CONTENT_LIST_DEFAULT_PAGE_SIZE } from "@/constants";
import {
  partialContentForContentList,
  partialContentForBanner,
  partialContentForGenres,
  partialContentForHottestList,
  partialContentForGenrePageList,
} from "../mongooseSelect";
import formatMongooseDoc from "../db/formatMongooseDoc";

export type ContentListFilter = {
  filterBy?: "tags" | "genres" | "status" | "genresPageList" | "word";
  sortBy?: "trending" | "new" | "updatedToday" | "hottest";
  tags?: Tags[];
  genres?: string[];
  status?: Status;
  word?: string;
  populate?: {
    from: string;
    localField: string;
    as: string;
    project: string;
  }[];
};

export type ContentListResponse = {
  error: boolean;
  errorMessage?: string;
  totalPages: number;
  totalContent: number;
  pageNumber: number;
  contentList: ContentType[];
};

async function getFilterQuery(listFilter: ContentListFilter) {
  const { filterBy, tags = [], status, genres = [], word } = listFilter;

  switch (filterBy) {
    case "tags":
      return { tags: { $in: tags } };

    case "status":
      return status ? { status } : {};

    case "genres":
    case "genresPageList": {
      if (genres.includes("all")) return status ? { status } : {};

      const genreIds = await Genre.find({
        name: { $in: genres.map((genre) => new RegExp(`^${genre}`, "i")) },
      }).select("_id");
      const genreFilter = {
        genres: { $in: genreIds.map((genre) => genre._id) },
      };

      return status ? { $and: [genreFilter, { status }] } : genreFilter;
    }

    case "word":
      return word
        ? {
            $or: [
              { title: { $regex: word, $options: "i" } },
              { synonyms: { $elemMatch: { $regex: word, $options: "i" } } },
            ],
          }
        : {};

    default:
      return {};
  }
}

function getSortQuery(
  listFilter: ContentListFilter,
): Record<string, SortOrder> {
  const { sortBy } = listFilter;

  switch (sortBy) {
    case "trending":
    case "hottest":
      return { rating: -1, noOfViews: -1, noOfSubscribers: -1 };

    case "new":
      return { createdAt: -1 };

    case "updatedToday":
      return { chaptersUpdatedOn: -1 };

    default:
      return {};
  }
}

function getPartialContentSelect(listFilter: ContentListFilter) {
  const { filterBy, tags = [], sortBy } = listFilter;

  if (filterBy === "tags" && tags.includes("BannerContent"))
    return partialContentForBanner;

  if (filterBy === "genresPageList") return partialContentForGenrePageList;
  if (filterBy === "genres") return partialContentForGenres;

  if (sortBy === "hottest") return partialContentForHottestList;

  return partialContentForContentList;
}

function getProjectFields(partialContent: string) {
  const fields = partialContent.split(" ");
  const projection: Record<string, 1> = {};

  fields.forEach((field) => {
    projection[field] = 1;
  });

  return projection;
}

function getLookupStages(listFilter: ContentListFilter) {
  const { populate = [] } = listFilter;

  return populate.map((populateItem) => ({
    $lookup: {
      from: populateItem.from,
      let: { ids: `$${populateItem.localField}` },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$_id", "$$ids"],
            },
          },
        },
        { $project: getProjectFields(populateItem.project) },
      ],
      as: populateItem.as,
    },
  }));
}

export default async function getContentList(
  listFilter: ContentListFilter,
  listPageNumber?: number,
  listSize?: number,
): Promise<ContentListResponse> {
  try {
    await connectToMongoDB();

    const pageSize = listSize ?? CONTENT_LIST_DEFAULT_PAGE_SIZE;
    const pageNumber = listPageNumber ?? 1;
    const skip = (pageNumber - 1) * pageSize;

    const filterQuery = await getFilterQuery(listFilter);
    const sortQuery: Record<string, 1 | -1> | {} = getSortQuery(listFilter);
    const lookupStages = getLookupStages(listFilter);
    const partialContent = getPartialContentSelect(listFilter);

    const aggregatedContentList = await Content.aggregate([
      {
        $facet: {
          metaData: [
            ...(Object.keys(filterQuery).length > 0
              ? [{ $match: filterQuery }]
              : []),
            { $count: "totalContent" },
          ],
          data: [
            ...(Object.keys(filterQuery).length > 0
              ? [{ $match: filterQuery }]
              : []),
            ...(Object.keys(sortQuery).length > 0
              ? [{ $sort: sortQuery }]
              : []),
            { $skip: skip },
            { $limit: pageSize },
            ...lookupStages,
            { $project: getProjectFields(partialContent) },
          ],
        },
      },
    ]);

    const { totalContent = 0 } = aggregatedContentList[0].metaData[0] ?? {};
    const contentList =
      aggregatedContentList[0].data?.map(formatMongooseDoc) ?? [];

    return {
      error: false,
      totalPages: Math.ceil(totalContent / pageSize),
      totalContent,
      pageNumber,
      contentList,
    };
  } catch (error: any) {
    return {
      error: true,
      errorMessage: error.message,
      totalPages: 1,
      totalContent: 0,
      pageNumber: 1,
      contentList: [],
    };
  }
}
