import bcrypt from "bcryptjs"
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js"


// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUserCtrl = expressAsyncHandler(
    async (req, res) => {
        const {fullname, email, password} = req.body;
    
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
            status:"success",
            message:"User Registered Successfully",
            data: user,
        })
    }
)

// @desc Login user
// @route POST /api/v1/users/login
// @access Public

export const loginUserCtrl = expressAsyncHandler(
    async(req, res) => {
        const {email, password} = req.body;
        // Find the user in db by email only
        const userFound = await User.findOne({email,})
        if(userFound && await bcrypt.compare(password, userFound?.password)){
            return res.json({
                status:"success",
                message:"User Login Successfully",
                userFound,
            })
        }else{
            throw new Error("Invalid Credentials")
            // res.json({
            //     msg: "Invalid Credentials"
            // })
        }
    }
)

