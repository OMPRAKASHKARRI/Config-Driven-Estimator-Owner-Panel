import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getAdminConfig, putAdminConfig, getLeads } from "../controllers/adminController.js";

const router = Router();

router.use(requireAuth);

router.get("/config", getAdminConfig);
router.put("/config", putAdminConfig);
router.get("/leads", getLeads);

export default router;
