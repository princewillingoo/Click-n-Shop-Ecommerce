import expressAsyncHandler from "express-async-handler";
import Brand from "../models/brand.model.js";
import { matchedData, validationResult } from "express-validator";


// @desc Create new brand
// @route Post /api/v1/brands
// access Private/Admin
export const createBrandCtrl = expressAsyncHandler(
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

        //brand exists
        const brandFound = await Brand.findOne({name})
        if(brandFound){
            let exception = new Error("Brand already exists")
            exception.statusCode = 409
            throw exception
        }

        // create
        const brand = await Brand.create({

            name: name.toLowerCase(),
            user: req.userAuthId,
            image: req.file.path
        });

        res.status(201).json({
            status: "success",
            message: "Brand created successfully",
            brand,
        });
    }
);


// @desc Get all brands
// @route Get /api/v1/brands
// access Public
export const getAllBrandsCtrl = expressAsyncHandler(
    async (req, res) => {
        const brands = await Brand.find();

        res.status(200).json({
            status: "Success",
            message: "Brands fetched successfully",
            brands,
        });
    }
);


// @desc Get single brand
// @route Get /api/v1/brands/:id
// access Public
export const getSingleBrandCtrl = expressAsyncHandler(
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

        const brand = await Brand.findById(id);

        res.status(200).json({
            status: "success",
            message: "Brand fetched successfully",
            brand,
        });
    }
);


// @desc Update brand
// @route Put /api/v1/brands/:id
// access Private/Admin
export const updateBrandCtrl = expressAsyncHandler(
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

        const { id, name } = matchedData(req); // req.body //

        // Update
        const brand = await Brand.findByIdAndUpdate(id, { name }, { new: true })

        res.json({
            status: "Success",
            message: "Brand updated successfully",
            brand,
        })
    }
)


// @desc Delete brand
// @route DELETE /api/v1/brands/:id/delete
// @access Private/Admin
export const deleteBrandCtrl = expressAsyncHandler(
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
        await Brand.findByIdAndDelete(id)

        res.status(204).json({
            status: "Success",
            message: "Brand deleted successfully",
        })
    }
)