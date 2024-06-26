import { NextResponse, NextRequest } from "next/server";

const chapters = [
  {
    _id: "1",
    title: "Chapter 1",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "2",
    title: "Chapter 2",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "3",
    title: "Chapter 3",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "4",
    title: "Chapter 4",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "5",
    title: "Chapter 5",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "6",
    title: "Chapter 6",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "7",
    title: "Chapter 7",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "8",
    title: "Chapter 8",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "9",
    title: "Chapter 9",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "10",
    title: "Chapter 10",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "11",
    title: "Chapter 11",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "12",
    title: "Chapter 12",
    releaseDate: "2022-04-19",
    noOfLike: 849,
    noOfComments: 923,
  },
  {
    _id: "13",
    title: "Chapter 13",
    releaseDate: "2022-04-26",
    noOfLike: 890,
    noOfComments: 950,
  },
  {
    _id: "14",
    title: "Chapter 14",
    releaseDate: "2022-05-03",
    noOfLike: 910,
    noOfComments: 980,
  },
  {
    _id: "15",
    title: "Chapter 15",
    releaseDate: "2022-05-10",
    noOfLike: 920,
    noOfComments: 1000,
  },
  {
    _id: "16",
    title: "Chapter 16",
    releaseDate: "2022-05-17",
    noOfLike: 950,
    noOfComments: 1030,
  },
  {
    _id: "17",
    title: "Chapter 17",
    releaseDate: "2022-05-24",
    noOfLike: 980,
    noOfComments: 1060,
  },
  {
    _id: "18",
    title: "Chapter 18",
    releaseDate: "2022-05-31",
    noOfLike: 1010,
    noOfComments: 1090,
  },
  {
    _id: "19",
    title: "Chapter 19",
    releaseDate: "2022-06-07",
    noOfLike: 1040,
    noOfComments: 1120,
  },
  {
    _id: "20",
    title: "Chapter 20",
    releaseDate: "2022-06-14",
    noOfLike: 1070,
    noOfComments: 1150,
  },
  {
    _id: "21",
    title: "Chapter 21",
    releaseDate: "2022-06-21",
    noOfLike: 1100,
    noOfComments: 1180,
  },
  {
    _id: "22",
    title: "Chapter 22",
    releaseDate: "2022-06-28",
    noOfLike: 1130,
    noOfComments: 1210,
  },
  {
    _id: "23",
    title: "Chapter 23",
    releaseDate: "2022-07-05",
    noOfLike: 1160,
    noOfComments: 1240,
  },
  {
    _id: "24",
    title: "Chapter 24",
    releaseDate: "2022-07-12",
    noOfLike: 1190,
    noOfComments: 1270,
  },
  {
    _id: "25",
    title: "Chapter 25",
    releaseDate: "2022-07-19",
    noOfLike: 1220,
    noOfComments: 1300,
  },
  {
    _id: "26",
    title: "Chapter 26",
    releaseDate: "2022-07-26",
    noOfLike: 1250,
    noOfComments: 1330,
  },
  {
    _id: "27",
    title: "Chapter 27",
    releaseDate: "2022-08-02",
    noOfLike: 1280,
    noOfComments: 1360,
  },
  {
    _id: "28",
    title: "Chapter 28",
    releaseDate: "2022-08-09",
    noOfLike: 1310,
    noOfComments: 1390,
  },
  {
    _id: "29",
    title: "Chapter 29",
    releaseDate: "2022-08-16",
    noOfLike: 1340,
    noOfComments: 1420,
  },
  {
    _id: "30",
    title: "Chapter 30",
    releaseDate: "2022-08-23",
    noOfLike: 1370,
    noOfComments: 1450,
  },
  {
    _id: "31",
    title: "Chapter 31",
    releaseDate: "2022-08-30",
    noOfLike: 1400,
    noOfComments: 1480,
  },
  {
    _id: "32",
    title: "Chapter 32",
    releaseDate: "2022-09-06",
    noOfLike: 1430,
    noOfComments: 1510,
  },
  {
    _id: "33",
    title: "Chapter 33",
    releaseDate: "2022-09-13",
    noOfLike: 1460,
    noOfComments: 1540,
  },
  {
    _id: "34",
    title: "Chapter 34",
    releaseDate: "2022-09-20",
    noOfLike: 1490,
    noOfComments: 1570,
  },
  {
    _id: "35",
    title: "Chapter 35",
    releaseDate: "2022-09-27",
    noOfLike: 1520,
    noOfComments: 1600,
  },
  {
    _id: "36",
    title: "Chapter 36",
    releaseDate: "2022-10-04",
    noOfLike: 1550,
    noOfComments: 1630,
  },
  {
    _id: "37",
    title: "Chapter 37",
    releaseDate: "2022-10-11",
    noOfLike: 1580,
    noOfComments: 1660,
  },
  {
    _id: "38",
    title: "Chapter 38",
    releaseDate: "2022-10-18",
    noOfLike: 1610,
    noOfComments: 1690,
  },
  {
    _id: "39",
    title: "Chapter 39",
    releaseDate: "2022-10-25",
    noOfLike: 1640,
    noOfComments: 1720,
  },
  {
    _id: "40",
    title: "Chapter 40",
    releaseDate: "2022-11-01",
    noOfLike: 1670,
    noOfComments: 1750,
  },
  {
    _id: "41",
    title: "Chapter 41",
    releaseDate: "2022-11-08",
    noOfLike: 1690,
    noOfComments: 1780,
  },
  {
    _id: "42",
    title: "Chapter 42",
    releaseDate: "2022-11-15",
    noOfLike: 1710,
    noOfComments: 1800,
  },
  {
    _id: "43",
    title: "Chapter 43",
    releaseDate: "2022-11-22",
    noOfLike: 1730,
    noOfComments: 1820,
  },
  {
    _id: "44",
    title: "Chapter 44",
    releaseDate: "2022-11-29",
    noOfLike: 1750,
    noOfComments: 1840,
  },
  {
    _id: "45",
    title: "Chapter 45",
    releaseDate: "2022-12-06",
    noOfLike: 1770,
    noOfComments: 1860,
  },
  {
    _id: "46",
    title: "Chapter 46",
    releaseDate: "2022-12-13",
    noOfLike: 1790,
    noOfComments: 1880,
  },
  {
    _id: "47",
    title: "Chapter 47",
    releaseDate: "2022-12-20",
    noOfLike: 1810,
    noOfComments: 1900,
  },
  {
    _id: "48",
    title: "Chapter 48",
    releaseDate: "2022-12-27",
    noOfLike: 1830,
    noOfComments: 1920,
  },
  {
    _id: "49",
    title: "Chapter 49",
    releaseDate: "2023-01-03",
    noOfLike: 1850,
    noOfComments: 1940,
  },
  {
    _id: "50",
    title: "Chapter 50",
    releaseDate: "2023-01-10",
    noOfLike: 1870,
    noOfComments: 1960,
  },
  {
    _id: "51",
    title: "Chapter 51",
    releaseDate: "2023-01-17",
    noOfLike: 1890,
    noOfComments: 1980,
  },
  {
    _id: "52",
    title: "Chapter 52",
    releaseDate: "2023-01-24",
    noOfLike: 1910,
    noOfComments: 2000,
  },
  {
    _id: "53",
    title: "Chapter 53",
    releaseDate: "2023-01-31",
    noOfLike: 1930,
    noOfComments: 2020,
  },
  {
    _id: "54",
    title: "Chapter 54",
    releaseDate: "2023-02-07",
    noOfLike: 1950,
    noOfComments: 2040,
  },
  {
    _id: "55",
    title: "Chapter 55",
    releaseDate: "2023-02-14",
    noOfLike: 1970,
    noOfComments: 2060,
  },
  {
    _id: "56",
    title: "Chapter 56",
    releaseDate: "2023-02-21",
    noOfLike: 1990,
    noOfComments: 2080,
  },
  {
    _id: "57",
    title: "Chapter 57",
    releaseDate: "2023-02-28",
    noOfLike: 2010,
    noOfComments: 2100,
  },
  {
    _id: "58",
    title: "Chapter 58",
    releaseDate: "2023-03-07",
    noOfLike: 2030,
    noOfComments: 2120,
  },
  {
    _id: "59",
    title: "Chapter 59",
    releaseDate: "2023-03-14",
    noOfLike: 2050,
    noOfComments: 2140,
  },
  {
    _id: "60",
    title: "Chapter 60",
    releaseDate: "2023-03-21",
    noOfLike: 2070,
    noOfComments: 2160,
  },
  {
    _id: "61",
    title: "Chapter 61",
    releaseDate: "2023-03-28",
    noOfLike: 2090,
    noOfComments: 2180,
  },
  {
    _id: "62",
    title: "Chapter 62",
    releaseDate: "2023-04-04",
    noOfLike: 2110,
    noOfComments: 2200,
  },
  {
    _id: "63",
    title: "Chapter 63",
    releaseDate: "2023-04-11",
    noOfLike: 2130,
    noOfComments: 2220,
  },
  {
    _id: "64",
    title: "Chapter 64",
    releaseDate: "2023-04-18",
    noOfLike: 2150,
    noOfComments: 2240,
  },
  {
    _id: "65",
    title: "Chapter 65",
    releaseDate: "2023-04-25",
    noOfLike: 2170,
    noOfComments: 2260,
  },
  {
    _id: "66",
    title: "Chapter 66",
    releaseDate: "2023-05-02",
    noOfLike: 2190,
    noOfComments: 2280,
  },
  {
    _id: "67",
    title: "Chapter 67",
    releaseDate: "2023-05-09",
    noOfLike: 2210,
    noOfComments: 2300,
  },
  {
    _id: "68",
    title: "Chapter 68",
    releaseDate: "2023-05-16",
    noOfLike: 2230,
    noOfComments: 2320,
  },
  {
    _id: "69",
    title: "Chapter 69",
    releaseDate: "2023-05-23",
    noOfLike: 2250,
    noOfComments: 2340,
  },
  {
    _id: "70",
    title: "Chapter 70",
    releaseDate: "2023-05-30",
    noOfLike: 2270,
    noOfComments: 2360,
  },
  {
    _id: "71",
    title: "Chapter 71",
    releaseDate: "2023-06-06",
    noOfLike: 2290,
    noOfComments: 2380,
  },
  {
    _id: "72",
    title: "Chapter 72",
    releaseDate: "2023-06-13",
    noOfLike: 2310,
    noOfComments: 2400,
  },
  {
    _id: "73",
    title: "Chapter 73",
    releaseDate: "2023-06-20",
    noOfLike: 2330,
    noOfComments: 2420,
  },
  {
    _id: "74",
    title: "Chapter 74",
    releaseDate: "2023-06-27",
    noOfLike: 2350,
    noOfComments: 2440,
  },
  {
    _id: "75",
    title: "Chapter 75",
    releaseDate: "2023-07-04",
    noOfLike: 2370,
    noOfComments: 2460,
  },
  {
    _id: "76",
    title: "Chapter 76",
    releaseDate: "2023-07-11",
    noOfLike: 2390,
    noOfComments: 2480,
  },
  {
    _id: "77",
    title: "Chapter 77",
    releaseDate: "2023-07-18",
    noOfLike: 2410,
    noOfComments: 2500,
  },
  {
    _id: "78",
    title: "Chapter 78",
    releaseDate: "2023-07-25",
    noOfLike: 2430,
    noOfComments: 2520,
  },
  {
    _id: "79",
    title: "Chapter 79",
    releaseDate: "2023-08-01",
    noOfLike: 2450,
    noOfComments: 2540,
  },
  {
    _id: "80",
    title: "Chapter 80",
    releaseDate: "2023-08-08",
    noOfLike: 2470,
    noOfComments: 2560,
  },
  {
    _id: "81",
    title: "Chapter 81",
    releaseDate: "2023-08-15",
    noOfLike: 2490,
    noOfComments: 2580,
  },
  {
    _id: "82",
    title: "Chapter 82",
    releaseDate: "2023-08-22",
    noOfLike: 2510,
    noOfComments: 2600,
  },
  {
    _id: "83",
    title: "Chapter 83",
    releaseDate: "2023-08-29",
    noOfLike: 2530,
    noOfComments: 2620,
  },
  {
    _id: "84",
    title: "Chapter 84",
    releaseDate: "2023-09-05",
    noOfLike: 2550,
    noOfComments: 2640,
  },
  {
    _id: "85",
    title: "Chapter 85",
    releaseDate: "2023-09-12",
    noOfLike: 2570,
    noOfComments: 2660,
  },
  {
    _id: "86",
    title: "Chapter 86",
    releaseDate: "2023-09-19",
    noOfLike: 2590,
    noOfComments: 2680,
  },
  {
    _id: "87",
    title: "Chapter 87",
    releaseDate: "2023-09-26",
    noOfLike: 2610,
    noOfComments: 2700,
  },
  {
    _id: "88",
    title: "Chapter 88",
    releaseDate: "2023-10-03",
    noOfLike: 2630,
    noOfComments: 2720,
  },
  {
    _id: "89",
    title: "Chapter 89",
    releaseDate: "2023-10-10",
    noOfLike: 2650,
    noOfComments: 2740,
  },
  {
    _id: "90",
    title: "Chapter 90",
    releaseDate: "2023-10-17",
    noOfLike: 2670,
    noOfComments: 2760,
  },
  {
    _id: "91",
    title: "Chapter 91",
    releaseDate: "2023-10-24",
    noOfLike: 2690,
    noOfComments: 2780,
  },
  {
    _id: "92",
    title: "Chapter 92",
    releaseDate: "2023-10-31",
    noOfLike: 2710,
    noOfComments: 2800,
  },
  {
    _id: "93",
    title: "Chapter 93",
    releaseDate: "2023-11-07",
    noOfLike: 2730,
    noOfComments: 2820,
  },
  {
    _id: "94",
    title: "Chapter 94",
    releaseDate: "2023-11-14",
    noOfLike: 2750,
    noOfComments: 2840,
  },
  {
    _id: "95",
    title: "Chapter 95",
    releaseDate: "2023-11-21",
    noOfLike: 2770,
    noOfComments: 2860,
  },
  {
    _id: "96",
    title: "Chapter 96",
    releaseDate: "2023-11-28",
    noOfLike: 2790,
    noOfComments: 2880,
  },
  {
    _id: "97",
    title: "Chapter 97",
    releaseDate: "2023-12-05",
    noOfLike: 2810,
    noOfComments: 2900,
  },
  {
    _id: "98",
    title: "Chapter 98",
    releaseDate: "2023-12-12",
    noOfLike: 2830,
    noOfComments: 2920,
  },
  {
    _id: "99",
    title: "Chapter 99",
    releaseDate: "2023-12-19",
    noOfLike: 2850,
    noOfComments: 2940,
  },
  {
    _id: "100",
    title: "Chapter 100",
    releaseDate: "2023-12-26",
    noOfLike: 2870,
    noOfComments: 2960,
  },
  {
    _id: "101",
    title: "Chapter 101",
    releaseDate: "2024-01-02",
    noOfLike: 2890,
    noOfComments: 2980,
  },
  {
    _id: "102",
    title: "Chapter 102",
    releaseDate: "2024-01-09",
    noOfLike: 2910,
    noOfComments: 3000,
  },
  {
    _id: "103",
    title: "Chapter 103",
    releaseDate: "2024-01-16",
    noOfLike: 2930,
    noOfComments: 3020,
  },
  {
    _id: "104",
    title: "Chapter 104",
    releaseDate: "2024-01-23",
    noOfLike: 2950,
    noOfComments: 3040,
  },
];

const getChapters = async (req: NextRequest) => {
  const PAGE_NUMBER = 1;
  const PAGE_SIZE = 18;

  const pagination =
    req.nextUrl.searchParams.get("pagination") &&
    req.nextUrl.searchParams.get("pagination") === "true";
  const pageNumber =
    Math.max(parseInt(req.nextUrl.searchParams.get("pageNumber")!), 0) ||
    PAGE_NUMBER;
  const pageSize =
    Math.max(parseInt(req.nextUrl.searchParams.get("pageSize")!), 0) ||
    PAGE_SIZE;
  const chaptersOrder: ChaptersOrder =
    (req.nextUrl.searchParams.get("chaptersOrder") as ChaptersOrder) ||
    "positive";

  try {
    if (pagination) {
      const startingIndex = (pageNumber - 1) * pageSize;
      const endingIndex = startingIndex + pageSize;

      // Fetch the chapters based on chaptersOrder
      const fetchedChapters =
        chaptersOrder === "reverse" ? chapters.slice().reverse() : chapters;

      return NextResponse.json(
        {
          error: false,
          chapters: fetchedChapters.slice(startingIndex, endingIndex),
          pageNumber: pageNumber,
          pageSize: pageSize,
          totalPages: Math.ceil(fetchedChapters.length / pageSize),
          totalChapters: fetchedChapters.length,
        },
        {
          status: 200,
        },
      );
    }

    const firstSix = chapters.slice(0, 6);
    const lastSix = chapters.length > 6 ? chapters.slice(-6) : [];

    return NextResponse.json(
      {
        error: false,
        chapters: [...firstSix, ...lastSix],
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalPages: Math.ceil(chapters.length / pageSize),
        totalChapters: chapters.length,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error.message,
        chapters: [],
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalPages: Math.ceil(chapters.length / pageSize),
        totalChapters: chapters.length,
      },
      {
        status: 500,
      },
    );
  }
};

export { getChapters as GET };
