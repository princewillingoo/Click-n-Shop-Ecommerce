import expressAsyncHandler from "express-async-handler";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto"
import { matchedData, validationResult } from "express-validator";
import Coupon from "../models/model.coupon.js";

dotenv.config()

//@desc Create Orders
//@route POST /api/v1/orders
//@access private
export const createOrderCtrl = expressAsyncHandler(
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        // get order payload
        const { orderItems, totalPrice, coupon } = matchedData(req) // req.body;

        let couponFound;
        if (coupon) {
            couponFound = await Coupon.findOne({
                code: coupon?.toUpperCase(),
            });
            if (!couponFound) {
                throw new Error('Invalid Coupon !!!')
            }
            if (couponFound?.isExpired) {
                throw new Error('Invalid Coupon !!!')
            }
        }

        // get discount 
        const discount = couponFound?.discount / 100;

        // find the user
        const user = await User.findById(req.userAuthId)

        // has shipping address?
        if (!user?.hasShippingAddress) {
            let error = new Error("Please Provide Shipping Address");
            error.statusCode = 400;
            throw error
        }

        // check if order not empty
        if (orderItems?.length <= 0) {
            let error = new Error("No Order Items");
            error.statusCode = 400
            throw error
        }

        // place/create order - save
        const order = await Order.create({
            user: user?._id,
            orderItems,
            shippingAddress: user.shippingAdress,
            totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
        });

        // update product quantity
        const products = await Product.find({ _id: { $in: orderItems } })
        orderItems?.map(async (order) => {
            const product = products?.find((product) => {
                return product?._id.toString() === order?._id.toString()
            })
            if (product) {
                product.totalSold += order.qty
            }
            await product.save();
        });

        //push order into user
        user.orders.push(order?._id);
        await user.save()

        // paystack payment gateway
        const successUrl = req.protocol + '://' + req.get('host') + '/api/v1/orders/payment/success';
        const cancelUrl = req.protocol + '://' + req.get('host') + '/api/v1/orders/payment/canceled';

        // Paystack checkout session data
        const sessionData = {
            email: user.email,
            amount: parseInt(order.totalPrice),
            callback_url: successUrl,
            metadata: JSON.stringify({
                orderNumber: order.orderNumber,
                cancel_action: cancelUrl,
            })
        };

        try {
            const { data } = await axios.post(
                'https://api.paystack.co/transaction/initialize',
                sessionData,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.Paystack_Key}`
                    }
                }
            )
            if (data?.status === true) {
                return res.send({ url: data?.data?.authorization_url })
            } else {
                res.status(200).json({
                    status: "failed",
                    message: "Something Went Wrong. Try Again!!!"
                })
            }

        } catch (error) {
            throw error
        }

        // payment webhook
        // update the user order
    }
)

//@desc Get Orders
//@route GET /api/v1/orders
//@access private
export const getAllOrdersCtrl = expressAsyncHandler(
    async (req, res) => {

        // find all orders
        const orders = await Order.find();

        if (orders.length === 0 || !orders) {
            const error = new Error("No orders found")
            error.statusCode = 404
            throw error
        }

        res.status(200).json({
            success: true,
            message: "All orders",
            orders,
        });
    }
)

//@desc Get Single Order
//@route GET /api/v1/orders/:id
//@access private/admin
export const getSingleOrderCtrl = expressAsyncHandler(
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        const { id } = matchedData(req) // req.params.id;
        const orders = await Order.findById(id);

        if (!orders) {
            const error = new Error(`Order with ID: ${id} not found`)
            error.statusCode = 404
            throw error
        }

        return res.status(200).json({
            success: true,
            message: "Single order found",
            orders,
        });
    }
)

//@desc update order to status
//@route PUT /api/v1/orders/update/:id
//@access private/admin
export const updateOrderCtrl = expressAsyncHandler(
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Field Validation Failed")
            error.statusCode = 422
            error.source = errors.array()
            throw error
        }

        // get id from params
        const { id, status } = matchedData(req) // req.params.id;

        // update
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: status },
            { new: true },
        );

        res.status(200).json({
            success: true,
            message: "Order updated",
            updatedOrder,
        });
    }
);

export const paymentSuccess = expressAsyncHandler(
    async (req, res) => {

        const { reference } = req.query;

        try {
            const { data: { data } } = await axios.get(
                `https://api.paystack.co/transaction/verify/${reference}`,
                {
                    headers: { Authorization: `Bearer ${process.env.Paystack_Key}` }
                }
            );

            if (data?.status === 'success') {
                const order = await Order.findOne({ orderNumber: data?.metadata?.orderNumber })
                if (order) {
                    order.paymentRef = reference;
                    await order.save();
                } else {
                    throw new Error('Order not found');
                }

                return res.status(200).json({
                    status: "success",
                    message: "Processing Payment!!!"
                })
            } else {
                res.status(200).json({
                    status: "pending",
                    message: "Pending Payment!!!"
                })
            }
        } catch (error) {
            throw error
        }
    }
);

export const paymentCanceled = expressAsyncHandler(
    async (req, res) => {
        res.status(200).json({
            status: "cancled",
            message: "You've cancled the payment process. Sorry!!!"
        })
    }
);

export const paymentWebHook = expressAsyncHandler(
    async (req, res) => {

        //validate event
        const hash = crypto.createHmac('sha512', process.env.Paystack_Key).update(JSON.stringify(req.body)).digest('hex');

        if (hash == req.headers['x-paystack-signature']) {
            // Retrieve the request's body
            const event = req.body;

            // Update order  
            if (event.event === 'charge.success') {

                const { orderNumber } = event.data.metadata;
                const paymentStatus = event.data.status = 'success' ? 'paid' : event.data.status
                const paymentMethod = event.data.channel;
                const totalAmount = event.data.amount;
                const currency = event.data.currency

                const order = await Order.findOneAndUpdate(
                    { orderNumber: orderNumber },
                    {
                        totalPrice: totalAmount,
                        paymentStatus,
                        paymentMethod,
                        currency
                    },
                    {
                        new: true
                    }
                )
                console.log(order)
            }
        }
        res.sendStatus(200);
    }
);