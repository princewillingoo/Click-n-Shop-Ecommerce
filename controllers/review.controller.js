import expressAsyncHandler from "express-async-handler";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import { matchedData, validationResult } from "express-validator";

// @desc Create new review
// @route Post /api/v1/reviews
// @access Private/Admin
export const createReviewCtrl = expressAsyncHandler(
    async (req, res) => {

        // Schema Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        const {productID, message, rating} = matchedData(req) // req.body;

        const productFound = await Product.findById(productID).populate("reviews");
        if (!productFound) {
            let error = new Error("Product Not Found");
            error.statusCode = 400
            throw error
        }

        // avoid duplicate
        const hasReviewed = productFound?.reviews?.find((review) => {
            return review?.user?.toString() === req?.userAuthId?.toString()
        });
        if (hasReviewed) {
            let error = new Error("You've already reviewed this product")
            error.statusCode = 409
            throw error
        }

        // create review
        const review = await Review.create({
            message,
            rating,
            product: productFound?._id,
            user: req.userAuthId,
        });

        // add review to product
        productFound.reviews.push(review?._id)

        //resave
        await productFound.save();

        res.status(201).json({
            success: true,
            message: "Review created successfully",
        });
    }
);