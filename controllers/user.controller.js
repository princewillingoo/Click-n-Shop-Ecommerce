import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwtHandler.util.js";
import { matchedData, validationResult } from "express-validator";


// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin
export const registerUserCtrl = expressAsyncHandler(
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // validationResult(req).throw();
            const error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        const { fullname, email, password } = matchedData(req) // req.body;

        // Check user exits
        const userExists = await User.findOne({ email });
        if (userExists) {

            let err = new Error("User already exists")
            err.statusCode = 409
            throw err
            // return res.json({
            //     msg: "User already exists",
            // });
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        // create user
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            status: "success",
            message: "User Registered Successfully",
            data: user,
        })
    }
)

// @desc Login user
// @route POST /api/v1/users/login
// @access Public
export const loginUserCtrl = expressAsyncHandler(
    async (req, res) => {

        const errors = validationResult(req);
        // console.log(errors)
        if (!errors.isEmpty()) {
            // validationResult(req).throw();
            const error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        const { email, password } = matchedData(req) // req.body;
        // Find the user in db by email only
        const userFound = await User.findOne({ email, })
        if (userFound && await bcrypt.compare(password, userFound?.password)) {
            return res.json({
                status: "success",
                message: "User Login Successfully",
                userFound,
                token: generateToken(userFound?._id)
            })
        } else {
            const error = new Error("Invalid Credentials")
            error.statusCode = 401
            throw error
            // res.json({
            //     msg: "Invalid Credentials"
            // })
        }
    }
)

// @desc Get user profile
// @route POST /api/v1/users/profile
// @access Private
export const getUserProfileCtrl = expressAsyncHandler(
    async (req, res) => {
        const user = await User.findById(req.userAuthId).populate("orders");

        res.json({
            status: "success",
            message: "User profile fetched successfully",
            user
        })
    }
)

// @desc Update user shipping address
// @route POST /api/v1/users/address
// @access Private
export const updateShippingAddressCtrl = expressAsyncHandler(
    async (req, res) => {
        const { firstName, lastName, address, city, postalCode, province, country, phone } = req.body;

        const user = await User.findByIdAndUpdate(req.userAuthId, {
            shippingAdress: {firstName, lastName, address, city, postalCode, province, country, phone},
            hasShippingAddress: true,
        },{
            new: true,
        })

        // send response
        res.json({
            status: "success",
            message: "User shipping address updated successfully",
            user,
        })
    }
)