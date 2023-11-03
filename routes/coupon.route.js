import { Router } from "express";
import { createCouponCtrl, deleteCouponCtrl, getAllCouponsCtrl, getCouponCtrl, updateCouponCtrl } from "../controllers/coupon.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";


const couponRouter = Router();

couponRouter.post('/', isLoggedIn, createCouponCtrl);
couponRouter.get('/', getAllCouponsCtrl);
couponRouter.get('/:id', getCouponCtrl);
couponRouter.put('/update/:id', updateCouponCtrl)
couponRouter.delete('/delete/:id', deleteCouponCtrl)


export default couponRouter