// routes/user.route.ts
import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth";
import USER_ROLE from "../../constants/userRole";
import { upload } from "../../middleware/multer";
const router = Router();

router.get("/", auth(USER_ROLE.admin), UserController.getAllUsers);
router.get("/:id", UserController.getOneUser);
router.post("/create-user", UserController.createUser);
router.put(
  "/update-user/:id",
  auth(USER_ROLE.admin, USER_ROLE.student),
  upload.single("image"),
  UserController.updateOneUser
);
router.patch("/status/:id", UserController.toggleUserStatus);

export const userRouter = router;
