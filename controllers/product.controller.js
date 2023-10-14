import expressAsyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import { matchedData, validationResult } from "express-validator";
import Category from "../models/category.model.js"

// @desc Create new product
// @route POST /api/v1/products
// @access Private/Admin
export const createProductCtrl = expressAsyncHandler(
    async (req, res) => {

        // Schema Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // validationResult(req).throw();
            let error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        const { name, description, category, brand, sizes, colors, price, totalQty } = matchedData(req)  // req.body;

        // Product exists
        const productExists = await Product.findOne({ name });
        if (productExists) {
            let err = new Error("Product Already Exists")
            err.statusCode = 403
            throw err
        }

        //find the category
        const categoryFound = await Category.findOne({ name: category, })
        if (!categoryFound) {
            let err = new Error("Category Not Found")
            err.statusCode = 404
            throw err
        }

        // Create the product
        const product = await Product.create({
            name,
            description,
            brand,
            category,
            sizes,
            colors,
            user: req.userAuthId,
            price,
            totalQty,
        });

        // Push the product into category
        categoryFound.products.push(product._id)
        // resave
        await categoryFound.save();

        //send response
        res.status(201).json({
            status: "Success",
            message: "Product Added Succesfully",
            product
        })
    }
)


// @desc Get all products
// @route GET /api/v1/products
// @access Public
export const getProductsCtrl = expressAsyncHandler(
    async (req, res) => {

        // Schema Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // validationResult(req).throw();
            let error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        // Query
        let productQuery = Product.find();

        // find by name
        if (matchedData.name) {
            productQuery = productQuery.find({
                name: { $regex: matchedData.name, $options: "i" }
            });
        }

        // find by brand
        if (matchedData.brand) {
            productQuery = productQuery.find({
                brand: { $regex: matchedData.brand, $options: "i" }
            });
        }

        // find by category
        if (matchedData.category) {
            productQuery = productQuery.find({
                category: { $regex: matchedData.category, $options: "i" }
            });
        }

        // find by colors
        if (matchedData.colors) {
            productQuery = productQuery.find({
                colors: { $regex: matchedData.colors, $options: "i" }
            });
        }

        // find by sizes
        if (matchedData.sizes) {
            productQuery = productQuery.find({
                sizes: { $regex: matchedData.sizes, $options: "i" }
            });
        }

        // find by price range
        if (matchedData.price) {
            const priceRange = matchedData.price.split("-")
            productQuery = productQuery.find({
                price: { $gte: priceRange[0], $lte: priceRange[1] },
            });
        }

        // pagination
        const page = parseInt(matchedData.page) ? parseInt(matchedData.page) : 1; // page
        const limit = parseInt(matchedData.limit) ? parseInt(matchedData.limit) : 10; // limit
        const startIndex = (page - 1) * limit; // startIndex
        const endIndex = (page) * limit; // endIndex
        const total = await Product.countDocuments(); // total

        productQuery = productQuery.skip(startIndex).limit(limit);

        // pagination results 
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        // await the Query
        const products = await productQuery; // Note; await ends the query

        res.json({
            status: "Success",
            total,
            results: products.length,
            pagination,
            message: "Product fetched seccessfully",
            products
        });
    }
);


// @desc Get single products
// @route GET /api/v1/products/:id
// @access Public
export const getProductCtrl = expressAsyncHandler(
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // validationResult(req).throw();
            let error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        const { id } = matchedData(req)
        const product = await Product.findById(id)

        if (!product) {
            let error = new Error("Product not found")
            error.statusCode = 404
            throw error
        }

        res.json({
            status: "Success",
            message: "Product retrived successfully",
            product,
        })
    }
)


// @desc Update product
// @route PUT /api/v1/products/:id
// @access Private/Admin
export const updateProductCtrl = expressAsyncHandler(
    async (req, res) => {

        // Schema Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // validationResult(req).throw();
            let error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }


        const { id, name, description, category, brand, sizes, colors, price, totalQty } = matchedData(req)  // req.body;

        //Update
        const product = await Product.findByIdAndUpdate(id, {
            name, description, category, brand, sizes, colors, price, totalQty
        }, { new: true })

        res.json({
            status: "Success",
            message: "Product updated successfully",
            product,
        })
    }
)


// @desc Delete product
// @route DELETE /api/v1/products/:id/delete
// @access Private/Admin
export const deleteProductCtrl = expressAsyncHandler(
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // validationResult(req).throw();
            let error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        const { id } = matchedData(req)
        await Product.findByIdAndDelete(id)

        res.status(204).json({
            status: "Success",
            message: "Product deleted successfully",
        })
    }
)