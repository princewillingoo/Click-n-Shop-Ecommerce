import express from "express";
import { registerUserCtrl, loginUserCtrl, getUserProfileCtrl } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";

import { checkExact, checkSchema, body } from "express-validator";


const userRoutes = express.Router();


userRoutes.post(
    "/register",
    checkSchema({
        fullname: { isString: true, errorMessage: "Invalid Name" },
        email: { isEmail: true, errorMessage: "Invalid Email Address" },
        password: { isLength: { options: { min: 5 } }, errorMessage: "Password Not Strong Enough" },
    }, ['body']),
    registerUserCtrl
);

userRoutes.post(
    "/login",
    checkExact([body('email').isEmail(), body('password').isLength({ min: 5 })], {
        message: 'Too many fields specified',
    }),
    loginUserCtrl
);

userRoutes.get("/profile", isLoggedIn, getUserProfileCtrl);

export default userRoutes;