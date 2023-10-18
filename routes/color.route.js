import { Router } from "express";
import {
    createColorCtrl,
    getAllColorsCtrl,
    getSingleColorCtrl,
    updateColorCtrl,
    deleteColorCtrl
} from "../controllers/color.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"
import { checkSchema, param } from "express-validator";
import { isValidObjectId } from "mongoose";

const colorsRouter = Router();

colorsRouter.post(
    "/", 
    checkSchema({
        name: {isString: true, errorMessage: "name must be string type" },
    }, ["body"]),
    isLoggedIn, 
    createColorCtrl
);

colorsRouter.get("/", getAllColorsCtrl);

colorsRouter.get(
    "/:id", 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    getSingleColorCtrl
);

colorsRouter.put(
    "/:id", 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    checkSchema({
        name: {isString: true, errorMessage: "name must be string type" },
    }, ["body"]),
    isLoggedIn, 
    updateColorCtrl
);

colorsRouter.delete(
    "/:id/delete", 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    isLoggedIn,  
    deleteColorCtrl
);

export default colorsRouter;
