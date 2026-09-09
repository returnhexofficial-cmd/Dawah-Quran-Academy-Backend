import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/CatchAsync";
import sendResponse from "../../utils/SendResponse";
import { ClassServices } from "./classes.service";

const createClass = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassServices.createClassDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Class link shared successfully",
    data: result,
  });
});

const getAllClasses = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassServices.getAllClassesDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Classes retrieved successfully",
    data: result,
  });
});

const getMyClasses = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassServices.getMyClassesDB(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My classes retrieved successfully",
    data: result,
  });
});

const getSingleClass = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassServices.getSingleClassDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Class retrieved successfully",
    data: result,
  });
});

const updateClass = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassServices.updateClassDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Class updated successfully",
    data: result,
  });
});

const deleteClass = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassServices.softDeleteClassDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Class deleted successfully",
    data: result,
  });
});

export const ClassController = {
  createClass,
  getAllClasses,
  getMyClasses,
  getSingleClass,
  updateClass,
  deleteClass,
};
