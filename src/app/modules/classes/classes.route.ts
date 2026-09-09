import express from "express";
import USER_ROLE from "../../constants/userRole";
import auth from "../../middleware/auth";
import { ClassController } from "./classes.controller";

const router = express.Router();

router.post("/", auth(USER_ROLE.admin), ClassController.createClass);
router.get("/", auth(USER_ROLE.admin), ClassController.getAllClasses);
router.get(
  "/my-classes",
  auth(USER_ROLE.student),
  ClassController.getMyClasses
);
router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.student),
  ClassController.getSingleClass
);
router.put("/:id", auth(USER_ROLE.admin), ClassController.updateClass);
router.delete("/:id", auth(USER_ROLE.admin), ClassController.deleteClass);

export const classRouter = router;
