import { Router } from "express";
import { postEstimate } from "../controllers/estimateController.js";

const router = Router();

router.post("/", postEstimate);

export default router;
