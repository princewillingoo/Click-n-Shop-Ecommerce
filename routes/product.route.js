import { Router } from "express";
import parser from "../configs/fileUpload.config.js"
import {
    createProductCtrl,
    getProductsCtrl,
    getProductCtrl,
    updateProductCtrl,
    deleteProductCtrl
} from "../controllers/product.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { checkSchema, param, query } from "express-validator";
import { isValidObjectId } from "mongoose";

const productRouter = Router();

productRouter.post(
    "/",
    parser.array('files'),
    checkSchema({
        name: { isString: true, errorMessage: "name must be string type" },
        description: { isString: true, errorMessage: "description must be string type" },
        category: { isString: true, errorMessage: "category must be string type" },
        brand: { isString: true, errorMessage: "brand must be string type" },
        sizes: { isArray: { options: { min: 2, max: 5 } }, errorMessage: "sizes must be array type" },
        colors: { isArray: true, errorMessage: "colors must be array type" },
        price: { isFloat: { options: { min: 10 } }, errorMessage: "price must be float type" },
        totalQty: { isInt: { options: { min: 3 } }, errorMessage: "quanity must be integer type" }
    }, ["body"]),
    isLoggedIn,
    createProductCtrl
);

productRouter.get(
    "/", 
    query(["name", "brand", "category", "colors", 
    "sizes", "price", "page", "limit"]).isString().optional(),
    getProductsCtrl
);

productRouter.get(
    "/:id",
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    getProductCtrl
);

productRouter.put(
    "/:id",
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    checkSchema({
        name: { isString: true, errorMessage: "name must be string type" },
        description: { isString: true, errorMessage: "description must be string type" },
        category: { isString: true, errorMessage: "category must be string type" },
        brand: { isString: true, errorMessage: "brand must be string type" },
        sizes: { isArray: { options: { min: 2, max: 5 } }, errorMessage: "sizes must be array type" },
        colors: { isArray: true, errorMessage: "colors must be array type" },
        price: { isFloat: { options: { min: 10 } }, errorMessage: "price must be float type" },
        totalQty: { isInt: { options: { min: 3 } }, errorMessage: "quanity must be integer type" }
    }, ["body"]),
    isLoggedIn,
    updateProductCtrl
);

productRouter.delete(
    "/:id/delete",
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    isLoggedIn,
    deleteProductCtrl
);

export default productRouter;