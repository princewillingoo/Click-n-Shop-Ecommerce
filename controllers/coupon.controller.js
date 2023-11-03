import expressAsyncHandler from "express-async-handler";
import Coupon from "../models/model.coupon.js";


// @desc Create new Coupon
// @route POST /api/v1/coupons
// @access Private/Admin
export const createCouponCtrl = expressAsyncHandler(
    async (req, res) => {
        const { code, startDate, endDate, discount } = req.body;
        // check if admin

        // check if coupon exists
        const couponsExists = await Coupon.findOne({ code });

        if (couponsExists) {
            let err = new Error("Coupon already exists");
            err.statusCode = 409;
            throw err
        }

        // create coupon
        const coupon = await Coupon.create({
            code: code?.toUpperCase(),
            startDate,
            endDate,
            discount,
            user: req.userAuthId
        });

        res.status(201).json({
            status: "success",
            message: "Coupon created successfully",
            coupon,
        });
    }
)

// @desc Get all Coupon
// @route GET /api/v1/coupons
// @access Private/Admin
export const getAllCouponsCtrl = expressAsyncHandler(
    async (req, res) => {
        const coupons = await Coupon.find();

        res.status(200).json({
            status: "success",
            message: "All coupons",
            coupons,
        });
    }
)

// @desc Get single Coupon
// @route GET /api/v1/coupons
// @access Private/Admin
export const getCouponCtrl = expressAsyncHandler(
    async (req, res) => {
        const coupon = await Coupon.findById(req.params.id);

        res.json({
            status: "success",
            message: "Coupon fetched",
            coupon,
        });
    }
);


export const updateCouponCtrl = expressAsyncHandler(
    async (req, res) => {
        const { code, startDate, endDate, discount } = req.body;

        const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
            code: code?.toUpperCase(),
            discount,
            startDate,
            endDate,
        }, { new: true, });

        res.json({
            status: "success",
            message: "Coupon updated successfully",
            coupon,
        })
    }
)


export const deleteCouponCtrl = expressAsyncHandler(
    async (req, res) => {
        
        await Coupon.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            message: "Coupon deleted successfully",
        })
    }
)