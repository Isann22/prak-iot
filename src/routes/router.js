import express from "express";
import controller from "../controller/controller.js";

const router = express.Router();
router.get("/sessions", controller.getSessionsData);
router.get("/stream", controller.streamData);

export default router;
