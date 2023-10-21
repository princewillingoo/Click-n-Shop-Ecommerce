import dotenv from 'dotenv'
import express from 'express';
import dbConnect from '../configs/dbConnect.config.js';
import userRoutes from '../routes/user.route.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.middleware.js';
import productRouter from '../routes/product.route.js';
import categoriesRouter from '../routes/category.route.js';
import brandsRouter from '../routes/brand.route.js';
import colorsRouter from '../routes/color.route.js';
import reviewRouter from '../routes/review.route.js';


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
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorsRouter);
app.use("/api/v1/reviews/", reviewRouter);

// err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;