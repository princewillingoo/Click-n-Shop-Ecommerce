import expressAsyncHandler from "express-async-handler";
import Color from "../models/color.model.js";
import { matchedData, validationResult } from "express-validator";


// @desc Create new color
// @route Post /api/v1/colors
// access Private/Admin
export const createColorCtrl = expressAsyncHandler(
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

        //color exists
        const colorFound = await Color.findOne({name})
        if(colorFound){
            let exception = new Error("Color already exists")
            exception.statusCode = 409
            throw exception
        }

        // create
        const color = await Color.create({

            name: name.toLowerCase(),
            user: req.userAuthId,
        });

        res.status(201).json({
            status: "success",
            message: "Color created successfully",
            color,
        });
    }
);


// @desc Get all colors
// @route Get /api/v1/colors
// access Public
export const getAllColorsCtrl = expressAsyncHandler(
    async (req, res) => {

        const colors = await Color.find();

        res.status(200).json({
            status: "Success",
            message: "Colors fetched successfully",
            colors,
        });
    }
);


// @desc Get single color
// @route Get /api/v1/colors/:id
// access Public
export const getSingleColorCtrl = expressAsyncHandler(
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
        const color = await Color.findById(id);

        res.status(200).json({
            status: "success",
            message: "Color fetched successfully",
            color,
        });
    }
);


// @desc Update color
// @route Put /api/v1/colors/:id
// access Private/Admin
export const updateColorCtrl = expressAsyncHandler(
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
        const color = await Color.findByIdAndUpdate(id, { name }, { new: true })

        res.json({
            status: "Success",
            message: "Color updated successfully",
            color,
        })
    }
)


// @desc Delete color
// @route DELETE /api/v1/colors/:id/delete
// @access Private/Admin
export const deleteColorCtrl = expressAsyncHandler(
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
        await Color.findByIdAndDelete(id)

        res.status(204).json({
            status: "Success",
            message: "Color deleted successfully",
        })
    }
)