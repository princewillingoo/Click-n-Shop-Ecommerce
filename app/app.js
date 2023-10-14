import dotenv from 'dotenv'
import express from 'express';
import dbConnect from '../configs/dbConnect.config.js';
import userRoutes from '../routes/user.route.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.middleware.js';
import productRouter from '../routes/product.route.js';
import categoriesRouter from '../routes/category.route.js';

// Environments
dotenv.config()

// db connect
dbConnect();

const app = express();

// parse incoming data
app.use(express.json())

// routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productRouter);
app.use("/api/v1/categories/", categoriesRouter);

// err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;