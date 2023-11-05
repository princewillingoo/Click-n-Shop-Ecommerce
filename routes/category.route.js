import { Router } from "express";
import {
    createCategoryCtrl,
    getAllCategoriesCtrl,
    getSingleCategoryCtrl,
    updateCategoryCtrl,
    deleteCategoryCtrl
} from "../controllers/category.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"
import { checkSchema, param } from "express-validator";
import { isValidObjectId } from "mongoose";
import parser from "../configs/fileUpload.config.js"

const categoriesRouter = Router();

categoriesRouter.post(
    "/", 
    parser.single("file"),
    checkSchema({
        name: {isString: true, errorMessage: "name must be string type" },
    }, ["body"]),
    isLoggedIn, 
    createCategoryCtrl
);

categoriesRouter.get("/", getAllCategoriesCtrl);

categoriesRouter.get(
    "/:id", 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    getSingleCategoryCtrl
);

categoriesRouter.put(
    "/:id", 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    checkSchema({
        name: {isString: true, errorMessage: "name must be string type" },
    }, ["body"]),
    isLoggedIn, 
    updateCategoryCtrl
);

categoriesRouter.delete(
    "/:id/delete", 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    isLoggedIn, 
    deleteCategoryCtrl
);

export default categoriesRouter;
