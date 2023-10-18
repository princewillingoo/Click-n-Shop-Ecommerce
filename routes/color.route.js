import { Router } from "express";
import {
    createColorCtrl,
    getAllColorsCtrl,
    getSingleColorCtrl,
    updateColorCtrl,
    deleteColorCtrl
} from "../controllers/color.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"

const colorsRouter = Router();

colorsRouter.post("/", isLoggedIn, createColorCtrl);
colorsRouter.get("/", getAllColorsCtrl);
colorsRouter.get("/:id", getSingleColorCtrl);
colorsRouter.put("/:id", isLoggedIn, updateColorCtrl);
colorsRouter.delete("/:id/delete", isLoggedIn, deleteColorCtrl);

export default colorsRouter;
