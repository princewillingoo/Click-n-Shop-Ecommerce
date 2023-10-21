import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { createReviewCtrl } from "../controllers/review.controller.js";
import { checkSchema, param } from "express-validator";
import { isValidObjectId } from "mongoose";

const reviewRouter = Router();

reviewRouter.post(
    "/:productID", 
    param("productID", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    checkSchema({
        message: { isString: true, errorMessage: "message must be string type" },
        rating: { isInt: { options: { min: 1, max: 5 } }, errorMessage: "rating must be integer type" }
    }, ["body"]),
    isLoggedIn, 
    createReviewCtrl
);

export default reviewRouter