import express from "express";
import { registerUserCtrl, loginUserCtrl } from "../controllers/user.controller.js";


const userRoutes = express.Router();


userRoutes.post("/api/v1/users/register", registerUserCtrl);
userRoutes.post("/api/v1/users/login", loginUserCtrl);


export default userRoutes;