import expressAsyncHandler from "express-async-handler";
import Category from "../models/category.model.js";
import { matchedData, validationResult } from "express-validator";

// @desc Create new category
// @route Post /api/v1/categories
// access Private/Admin
export const createCategoryCtrl = expressAsyncHandler(
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
        
        const { name } =  matchedData(req) // req.body;

        //category exists
        const categoryFound = await Category.findOne({name})
        if(categoryFound){
            let exception = new Error("Category already exists")
            exception.statusCode = 409
            throw exception
        }

        // create
        const category = await Category.create({
            name: name.toLowerCase(),
            user: req.userAuthId,
        });

        res.status(201).json({
            status: "success",
            message: "Category created successfully",
            category,
        });
    }
);


// @desc Get all categories
// @route Get /api/v1/categories
// access Public
export const getAllCategoriesCtrl = expressAsyncHandler(
    async (req, res) => {

        const categories = await Category.find();

        res.status(200).json({
            status: "success",
            message: "Categories fetched successfully",
            categories,
        });
    }
);


// @desc Get single category
// @route Get /api/v1/categories/:id
// access Public
export const getSingleCategoryCtrl = expressAsyncHandler(
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

        const { id } = matchedData(req)

        const category = await Category.findById(id);

        res.status(200).json({
            status: "success",
            message: "Category fetched successfully",
            category,
        });
    }
);


// @desc Update category
// @route Put /api/v1/categories/:id
// access Private/Admin
export const updateCategoryCtrl = expressAsyncHandler(
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


        const { id, name } =  matchedData(req); // req.body //

        // Update
        const category = await Category.findByIdAndUpdate(
            id, { name }, { new: true }
        )

        res.json({
            status: "Success",
            message: "Category updated successfully",
            category,
        })
    }
)


// @desc Delete category
// @route DELETE /api/v1/categories/:id/delete
// @access Private/Admin
export const deleteCategoryCtrl = expressAsyncHandler(
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
        await Category.findByIdAndDelete(id)

        res.status(204).json({
            status: "Success",
            message: "Category deleted successfully",
        })
    }
)