import { Router } from "express";
import {
    createBrandCtrl,
    getAllBrandsCtrl,
    getSingleBrandCtrl,
    updateBrandCtrl,
    deleteBrandCtrl
} from "../controllers/brand.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"
import { isValidObjectId } from "mongoose";
import { checkSchema, param } from "express-validator";
import parser from "../configs/fileUpload.config.js"

const brandsRouter = Router();

brandsRouter.post(
    "/", 
    parser.single("file"),
    checkSchema({
        name: {isString: true, errorMessage: "name must be string type" },
    }, ["body"]),
    isLoggedIn, 
    createBrandCtrl
);

brandsRouter.get("/", getAllBrandsCtrl);

brandsRouter.get(
    "/:id", 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    getSingleBrandCtrl
);

brandsRouter.put(
    "/:id", 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    checkSchema({
        name: {isString: true, errorMessage: "name must be string type" },
    }, ["body"]),
    isLoggedIn, 
    updateBrandCtrl
);

brandsRouter.delete(
    "/:id/delete", 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    isLoggedIn, 
    deleteBrandCtrl);

export default brandsRouter;
