import { Router } from "express";
import { createOrderCtrl, getAllOrdersCtrl, getSingleOrderCtrl, paymentCanceled, paymentSuccess, paymentWebHook } from "../controllers/order.controller.js"
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import cors from "cors"

const orderRouter = Router();


orderRouter.post('/', isLoggedIn, createOrderCtrl)
orderRouter.get('/', isLoggedIn, getAllOrdersCtrl)
orderRouter.get('/:id', isLoggedIn, getSingleOrderCtrl)

orderRouter.get('/payment/success', paymentSuccess)
orderRouter.get('/payment/canceled', paymentCanceled)
orderRouter.post('/payment/webhook', cors(), paymentWebHook)

export default orderRouter