import { Router } from "express";
import { createCouponCtrl, deleteCouponCtrl, getAllCouponsCtrl, getCouponCtrl, updateCouponCtrl } from "../controllers/coupon.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { checkExact, checkSchema, param } from "express-validator";
import { isValidObjectId } from "mongoose";

const couponRouter = Router();

couponRouter.post(
    '/', 
    checkExact([checkSchema({
        code: {isString: true},
        discount: {isInt: true},
        startDate: {isDate: true},
        endDate: {isDate: true},
    }, ['body'])]),
    isLoggedIn, 
    createCouponCtrl
);

couponRouter.get('/', getAllCouponsCtrl);

couponRouter.get(
    '/:id', 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    getCouponCtrl
);

couponRouter.put(
    '/update/:id', 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    checkExact([checkSchema({
        code: {isString: true},
        discount: {isInt: true},
        startDate: {isDate: true},
        endDate: {isDate: true},
    }, ['body'])]),
    updateCouponCtrl
)

couponRouter.delete(
    '/delete/:id', 
    param("id", "Invalid Path Paramater").custom(value => {
        return isValidObjectId(value)
    }),
    deleteCouponCtrl
)


export default couponRouter