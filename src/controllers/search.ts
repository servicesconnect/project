import { projectsSearch } from "@project/services/search.service";
import {
  IPaginateProps,
  ISearchResult,
  ISellerProject,
} from "@project/interfaces";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sortBy } from "lodash";

const projects = async (req: Request, res: Response): Promise<void> => {
  const { from, size, type } = req.params;
  let resultHits: ISellerProject[] = [];
  const paginate: IPaginateProps = { from, size: parseInt(`${size}`), type };
  const projects: ISearchResult = await projectsSearch(
    `${req.query.query}`,
    paginate,
    `${req.query.delivery_time}`,
    parseInt(`${req.query.minprice}`),
    parseInt(`${req.query.maxprice}`)
  );
  for (const item of projects.hits) {
    resultHits.push(item._source as ISellerProject);
  }
  if (type === "backward") {
    resultHits = sortBy(resultHits, ["sortId"]);
  }
  res.status(StatusCodes.OK).json({
    message: "Search projects results",
    total: projects.total,
    projects: resultHits,
  });
};

export { projects };
