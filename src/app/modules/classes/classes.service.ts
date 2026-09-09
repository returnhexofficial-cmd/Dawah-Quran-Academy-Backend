import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import ApiError from "../../utils/AppError";
import { User } from "../users/user.model";
import { IClass, TClassPlatform } from "./classes.interface";
import { Class } from "./classes.model";

const STUDENT_FIELDS = "name email image";

/**
 * Works out which meeting provider a link belongs to so the admin does not
 * have to pick one by hand. Anything we do not recognise is "other" - the
 * link still works, it just gets a neutral label.
 */
const detectPlatform = (link: string): TClassPlatform => {
  let host = "";
  try {
    host = new URL(link).hostname.toLowerCase();
  } catch {
    return "other";
  }

  if (host === "meet.google.com" || host.endsWith(".meet.google.com")) {
    return "google-meet";
  }
  if (host === "zoom.us" || host.endsWith(".zoom.us")) {
    return "zoom";
  }
  return "other";
};

const assertValidLink = (link: string) => {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Class link must be a valid URL (e.g. https://meet.google.com/abc-defg-hij)"
    );
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Class link must start with http:// or https://"
    );
  }
};

const assertValidSchedule = (scheduledAt: Date | string) => {
  const date = new Date(scheduledAt);
  if (isNaN(date.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Class schedule is not a valid date");
  }
  return date;
};

/**
 * For a targeted class, every id must belong to a live student account -
 * otherwise the class would silently reach nobody.
 */
const assertValidStudents = async (students: unknown) => {
  if (!Array.isArray(students) || students.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Select at least one student, or set the audience to all students"
    );
  }

  // Reject junk ids up front - handing them to mongoose would throw a CastError
  // and surface as a 500 instead of a useful message.
  if (!students.every((id) => isValidObjectId(id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid student id in the list");
  }

  const found = await User.find({
    _id: { $in: students },
    role: "student",
    isDeleted: false,
  }).select("_id");

  if (found.length !== new Set(students.map(String)).size) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "One or more selected students could not be found"
    );
  }

  return found.map((student) => student._id);
};

const createClassDB = async (data: IClass) => {
  assertValidLink(data.link);
  const scheduledAt = assertValidSchedule(data.scheduledAt);

  const audience = data.audience === "selected" ? "selected" : "all";
  const students =
    audience === "selected" ? await assertValidStudents(data.students) : [];

  const created = await Class.create({
    ...data,
    scheduledAt,
    audience,
    students,
    platform: data.platform || detectPlatform(data.link),
    isDeleted: false,
  });

  return created.populate("students", STUDENT_FIELDS);
};

const getAllClassesDB = async () => {
  return Class.find({ isDeleted: false })
    .populate("students", STUDENT_FIELDS)
    .sort({ scheduledAt: -1 });
};

/**
 * A student sees classes broadcast to everyone plus the ones addressed to them.
 */
const getMyClassesDB = async (user: JwtPayload) => {
  return Class.find({
    isDeleted: false,
    $or: [{ audience: "all" }, { students: user.userId }],
  }).sort({ scheduledAt: -1 });
};

const getSingleClassDB = async (id: string) => {
  const singleClass = await Class.findOne({ _id: id, isDeleted: false }).populate(
    "students",
    STUDENT_FIELDS
  );
  if (!singleClass) {
    throw new ApiError(httpStatus.NOT_FOUND, "Class not found or has been deleted!");
  }
  return singleClass;
};

const updateClassDB = async (id: string, data: Partial<IClass>) => {
  const payload: Partial<IClass> = { ...data };

  if (payload.link) {
    assertValidLink(payload.link);
    // Keep the badge in step with the link unless the admin set one explicitly.
    payload.platform = data.platform || detectPlatform(payload.link);
  }

  if (payload.scheduledAt) {
    payload.scheduledAt = assertValidSchedule(payload.scheduledAt);
  }

  if (payload.audience === "all") {
    payload.students = [];
  } else if (payload.audience === "selected" || payload.students) {
    // Covers a partial update that changes the student list without
    // restating the audience.
    payload.students = await assertValidStudents(payload.students);
  }

  const updated = await Class.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: payload },
    { new: true }
  ).populate("students", STUDENT_FIELDS);

  if (!updated) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Unable to update: class not found or deleted!"
    );
  }
  return updated;
};

const softDeleteClassDB = async (id: string) => {
  const deleted = await Class.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
  if (!deleted) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Unable to delete: class not found or already deleted!"
    );
  }
  return deleted;
};

export const ClassServices = {
  createClassDB,
  getAllClassesDB,
  getMyClassesDB,
  getSingleClassDB,
  updateClassDB,
  softDeleteClassDB,
};
