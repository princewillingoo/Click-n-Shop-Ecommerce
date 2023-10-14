import { Router } from "express";
import {
    createCategoryCtrl,
    getAllCategoriesCtrl,
    getSingleCategoryCtrl,
    updateCategoryCtrl,
    deleteCategoryCtrl
} from "../controllers/category.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"

const categoriesRouter = Router();

categoriesRouter.post("/", isLoggedIn, createCategoryCtrl);
categoriesRouter.get("/", getAllCategoriesCtrl);
categoriesRouter.get("/:id", getSingleCategoryCtrl);
categoriesRouter.put("/:id", isLoggedIn, updateCategoryCtrl);
categoriesRouter.delete("/:id/delete", isLoggedIn, deleteCategoryCtrl);

export default categoriesRouter;
