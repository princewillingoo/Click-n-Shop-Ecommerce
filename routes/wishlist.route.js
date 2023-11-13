import { Router } from "express";
import { addProductToWishlist, removeProductFromWishlist } from "../controllers/wishlist.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { body, checkExact, param } from "express-validator";
import { isValidObjectId } from "mongoose";

const wishlistRoutes = Router()

wishlistRoutes.post(
    '/add/', 
    checkExact(
        [body('product_id').isMongoId().withMessage("Not a valid product id")]
    ),
    isLoggedIn, 
    addProductToWishlist
)
wishlistRoutes.delete(
    '/delete/:productId', 
    param("productId", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    isLoggedIn, 
    removeProductFromWishlist
)

export default wishlistRoutes
