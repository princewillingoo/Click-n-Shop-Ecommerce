import dotenv from 'dotenv'
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/user.route.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.middleware.js';

// Environments
dotenv.config()

// db connect
dbConnect();

const app = express();

// parse incoming data
app.use(express.json())

// routes
app.use("/", userRoutes);

// err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;