import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/CatchAsync";
import sendResponse from "../../utils/SendResponse";
import { SiteConfigServices } from "./siteConfig.service";

const getSiteConfig = catchAsync(async (req: Request, res: Response) => {
  const result = await SiteConfigServices.getSiteConfigDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Site config retrieved successfully",
    data: result,
  });
});

const updateSiteConfig = catchAsync(async (req: Request, res: Response) => {
  const result = await SiteConfigServices.updateSiteConfigDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Site config updated successfully",
    data: result,
  });
});

export const SiteConfigController = {
  getSiteConfig,
  updateSiteConfig,
};
