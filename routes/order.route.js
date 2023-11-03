import { Router } from "express";
import {
    createOrderCtrl,
    getAllOrdersCtrl,
    getSingleOrderCtrl,
    updateOrderCtrl,
    paymentCanceled,
    paymentSuccess,
    paymentWebHook
} from "../controllers/order.controller.js"
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import cors from "cors"
import { body, param, query } from "express-validator";
import { isValidObjectId } from "mongoose";

const orderRouter = Router();


orderRouter.post(
    '/',
    body('orderItems', 'Invalid Order Items').isArray({ min: 1 }),
    body('totalPrice', 'Invalid Price Total').isInt({ min: 10, max: 5000 }),
    query('coupon', 'Invalid Coupon').isString().optional(),
    isLoggedIn,
    createOrderCtrl
)
orderRouter.get('/', isLoggedIn, getAllOrdersCtrl)
orderRouter.get(
    '/:id',
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    isLoggedIn,
    getSingleOrderCtrl
)
orderRouter.put(
    '/update/:id',
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    body("status", "Invalid Order Status").custom(value => {
        const arr = ['pending', 'processing', 'shipped', 'delivered']
        if (arr.includes(value)) {
            return value;
        }
    }),
    isLoggedIn,
    updateOrderCtrl
)

orderRouter.get('/payment/success', paymentSuccess)
orderRouter.get('/payment/canceled', paymentCanceled)
orderRouter.post('/payment/webhook', cors(), paymentWebHook)

export default orderRouter