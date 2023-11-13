import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { matchedData, validationResult } from "express-validator";

export const addProductToWishlist = expressAsyncHandler(
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        const user = await User.findById(req.userAuthId);
        const product = await Product.findById(matchedData(req).product_id);

        if (!product) {
            let error = new Error('Product Does Not Exist');
            error.statusCode = 404;
            throw error;
        }

        // Check if the product is already in the wishlist
        if (user.wishLists.includes(product._id)) {
            let error = new Error('Product is already in users wishlist');
            error.statusCode = 400;
            throw error;
        }

        // Add the product to the wishlist
        user.wishLists.push(product._id);
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Product added to the wishlist successfully',
            data: user.wishLists,
        });
    }
);


export const removeProductFromWishlist = expressAsyncHandler(
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        const user = await User.findById(req.userAuthId);
        const product = await Product.findById(matchedData(req).productId);

        if (!product) {
            let error = new Error('Product Does Not Exist');
            error.statusCode = 404;
            throw error;
        }

        // Check if the product is in the wishlist
        const index = user.wishLists.indexOf(product._id);
        if (index === -1) {
            let error = new Error("Product is not in the wishlist")
            error.statusCode = 404
            throw error
        }

        // Remove the product from the wishlist
        user.wishLists.splice(index, 1);
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Product removed from the wishlist successfully',
            data: user.wishLists,
        });
    }
);