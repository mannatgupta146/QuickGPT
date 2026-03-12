import express from "express";
import { getCommunityImages } from "../controllers/imageController.js";

const imageRouter = express.Router();

imageRouter.get("/get", getCommunityImages);

export default imageRouter;
