import express from "express";
import { TeacherController } from "./teachers.controller";
import auth from "../../middleware/auth";
import USER_ROLE from "../../constants/userRole";
import { upload } from "../../middleware/multer";

const router = express.Router();

router.get("/", TeacherController.getAllTeachers);

router.post(
  "/",
  auth(USER_ROLE.admin),
  upload.single("profileImage"),
  TeacherController.createTeacher
);

router.get("/:id", TeacherController.getSingleTeacher);

router.delete(
  "/:id",
  auth(USER_ROLE.admin),
  TeacherController.deleteTeacher
);

router.put(
  "/:id",
  auth(USER_ROLE.admin),
  upload.single("profileImage"),
  TeacherController.updateTeacher
);

export const teacherRouter = router;