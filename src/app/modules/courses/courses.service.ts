import { Course } from "./courses.model";
import { ICourse } from "./courses.interface";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploadToCloudinary";
import ApiError from "../../utils/AppError";
import httpStatus from "http-status";

const getAllCoursesDB = async () => {
  return await Course.find({ isDeleted: false });
};

const getSingleCourseDB = async (id: string) => {
  const course = await Course.findOne({ _id: id, isDeleted: false });
  if (!course) {
    throw new Error("Course not found or has been deleted!");
  }
  return course;
};

const createCourseDB = async (
  payload: Partial<ICourse>,
  file?: Express.Multer.File
) => {
  const exists = await Course.findOne({ name: payload.name });
  if (exists) {
    throw new Error("A course with this title already exists!");
  }

  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, "courses");
    payload.img = uploadResult.secure_url;
    payload.coverPublicId = uploadResult.public_id;
  }

  return await Course.create(payload);
};

const updateCourseDB = async (
  id: string,
  payload: Partial<ICourse>,
  file?: Express.Multer.File
) => {
  const isCourseExists = await Course.findById(id);
  if (!isCourseExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course Not Found!");
  }

  if (file) {
    if (isCourseExists.coverPublicId) {
      await deleteFromCloudinary(isCourseExists.coverPublicId);
    }
    const uploadResult = await uploadToCloudinary(file.buffer, "courses");
    payload.img = uploadResult.secure_url;
    payload.coverPublicId = uploadResult.public_id;
  }

  const result = await Course.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: payload },
    { new: true, runValidators: true }
  );
  if (!result) {
    throw new Error("Unable to update: course not found or deleted!");
  }
  return result;
};

const softDeleteCourseDB = async (id: string) => {
  const deleted = await Course.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
  if (!deleted) {
    throw new Error("Unable to delete: course not found or already deleted!");
  }
  return deleted;
};

export const CourseServices = {
  getAllCoursesDB,
  getSingleCourseDB,
  createCourseDB,
  updateCourseDB,
  softDeleteCourseDB,
};