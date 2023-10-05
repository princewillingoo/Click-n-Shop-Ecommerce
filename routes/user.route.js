import express from "express";
import { registerUserCtrl, loginUserCtrl, getUserProfileCtrl } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";


const userRoutes = express.Router();


userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/profile", isLoggedIn, getUserProfileCtrl);

export default userRoutes;