import express from "express";
import { deleteCommunityImage, getCommunityImages } from "../controllers/imageController.js";
import { protect } from "../middlewares/Auth.js";

const imageRouter = express.Router();

imageRouter.get("/get", getCommunityImages);
imageRouter.post("/delete", protect, deleteCommunityImage);

export default imageRouter;
