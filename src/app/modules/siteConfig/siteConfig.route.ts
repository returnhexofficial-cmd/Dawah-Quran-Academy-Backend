import express from "express";
import USER_ROLE from "../../constants/userRole";
import auth from "../../middleware/auth";
import { SiteConfigController } from "./siteConfig.controller";

const router = express.Router();

// Public: the navbar, footer and contact page read this on every visit.
router.get("/", SiteConfigController.getSiteConfig);

router.put("/", auth(USER_ROLE.admin), SiteConfigController.updateSiteConfig);

export const siteConfigRouter = router;
