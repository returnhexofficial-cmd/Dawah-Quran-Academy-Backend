import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/CatchAsync";
import sendResponse from "../../utils/SendResponse";
import { CourseServices } from "./courses.service";

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    fee: Number(req.body.fee),
    details: req.body.details ? JSON.parse(req.body.details) : [],
  };

  const result = await CourseServices.createCourseDB(payload, req.file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course added successfully",
    data: result,
  });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseServices.getAllCoursesDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses retrieved successfully",
    data: result,
  });
});

const getSingleCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books retrieved successfully",
    data: result,
  });
});

const updateCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = {
    ...req.body,
    ...(req.body.fee && { fee: Number(req.body.fee) }),
    ...(req.body.details && { details: JSON.parse(req.body.details) }),
  };

  const result = await CourseServices.updateCourseDB(id, payload, req.file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});
const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseServices.softDeleteCourseDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  getSingleCourses,
  updateCourses,
  deleteCourse,
};
