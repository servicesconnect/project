import { SearchResponse } from "@elastic/elasticsearch/lib/api/types";
import { elasticSearchClient } from "@project/config";
import {
  IHitsTotal,
  IPaginateProps,
  IQueryList,
  ISearchResult,
} from "@project/interfaces";

const projectsSearchBySellerId = async (
  searchQuery: string,
  active: boolean
): Promise<ISearchResult> => {
  const queryList: IQueryList[] = [
    {
      query_string: {
        fields: ["sellerId"],
        query: `*${searchQuery}*`,
      },
    },
    {
      term: {
        active,
      },
    },
  ];
  const result: SearchResponse = await elasticSearchClient.search({
    index: "projects",
    query: {
      bool: {
        must: [...queryList],
      },
    },
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits,
  };
};

const projectsSearch = async (
  searchQuery: string,
  paginate: IPaginateProps,
  deliveryTime?: string,
  min?: number,
  max?: number
): Promise<ISearchResult> => {
  const { from, size, type } = paginate;
  const queryList: IQueryList[] = [
    {
      query_string: {
        fields: [
          "username",
          "title",
          "description",
          "basicDescription",
          "basicTitle",
          "categories",
          "subCategories",
          "tags",
        ],
        query: `*${searchQuery}*`,
      },
    },
    {
      term: {
        active: true,
      },
    },
  ];

  if (deliveryTime !== "undefined") {
    queryList.push({
      query_string: {
        fields: ["expectedDelivery"],
        query: `*${deliveryTime}*`,
      },
    });
  }

  if (!isNaN(parseInt(`${min}`)) && !isNaN(parseInt(`${max}`))) {
    queryList.push({
      range: {
        price: {
          gte: min,
          lte: max,
        },
      },
    });
  }
  const result: SearchResponse = await elasticSearchClient.search({
    index: "projects",
    size,
    query: {
      bool: {
        must: [...queryList],
      },
    },
    sort: [
      {
        sortId: type === "forward" ? "asc" : "desc",
      },
    ],
    ...(from !== "0" && { search_after: [from] }),
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits,
  };
};

const projectsSearchByCategory = async (
  searchQuery: string
): Promise<ISearchResult> => {
  const result: SearchResponse = await elasticSearchClient.search({
    index: "projects",
    size: 10,
    query: {
      bool: {
        must: [
          {
            query_string: {
              fields: ["categories"],
              query: `*${searchQuery}*`,
            },
          },
          {
            term: {
              active: true,
            },
          },
        ],
      },
    },
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits,
  };
};

const getMoreProjectsLikeThis = async (
  projectId: string
): Promise<ISearchResult> => {
  const result: SearchResponse = await elasticSearchClient.search({
    index: "projects",
    size: 5,
    query: {
      more_like_this: {
        fields: [
          "username",
          "title",
          "description",
          "basicDescription",
          "basicTitle",
          "categories",
          "subCategories",
          "tags",
        ],
        like: [
          {
            _index: "projects",
            _id: projectId,
          },
        ],
      },
    },
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits,
  };
};

const getTopRatedProjectsByCategory = async (
  searchQuery: string
): Promise<ISearchResult> => {
  const result: SearchResponse = await elasticSearchClient.search({
    index: "projects",
    size: 10,
    query: {
      bool: {
        filter: {
          script: {
            script: {
              source:
                "doc['ratingSum'].value != 0 && (doc['ratingSum'].value / doc['ratingsCount'].value == params['threshold'])",
              lang: "painless",
              params: {
                threshold: 5,
              },
            },
          },
        },
        must: [
          {
            query_string: {
              fields: ["categories"],
              query: `*${searchQuery}*`,
            },
          },
        ],
      },
    },
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits,
  };
};

export {
  projectsSearchBySellerId,
  projectsSearch,
  projectsSearchByCategory,
  getMoreProjectsLikeThis,
  getTopRatedProjectsByCategory,
};
