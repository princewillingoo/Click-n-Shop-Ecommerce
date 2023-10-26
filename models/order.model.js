import mongoose from "mongoose";

const Schema = mongoose.Schema;

const randomTxt = Math.random().toString(36).substring(7).toLocaleLowerCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000)

const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            type: Object,
            required: true,
        },
    ],
    shippingAddress: {
        type: Object,
        required: true
    },
    orderNumber:{
        type: String,
        required: true,
        default: randomTxt + randomNumbers
    },
    paymentStatus:{
        type: String,
        default: "Not paid",
    },
    paymentMethod: {
        type: String,
        default: "Not specified",
    },
    totalPrice: {
        type: Number,
        default: 0.0,
    },
    currency: {
        type: String,
        default: "Not specified",
    },
    status: {
        type: String,
        default: "pending",
        enum: ['pending', 'processing', 'shipped', 'delivered'],
    },
    deliveredAt: {
        type: Date,
    },
    paymentRef: {
        type: String
    }
}, {
    timestamps: true,
});


const Order = mongoose.model('Order', OrderSchema);

export default Order;