import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            ref: "Category",
            required: true,
        },
        sizes: {
            type: [String],
            enum: ["S", "M", "L", "XL", "XXL"],
            required: true,
        },
        colors: {
            type: [String],
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            }
        ],
        price: {
            type: Number,
            required: true
        },
        totalQty: {
            type: Number,
            required: true,
        },
        totalSold: {
            type: Number,
            required: true,
            default: 0,
        },
    },{
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// quantity left
ProductSchema.virtual('quantityLeft').get(function(){
    return this.totalQty - this.totalSold;
})
// reviews
ProductSchema.virtual("totalReviews").get(function(){
    const product = this;
    return product?.reviews?.length;
});
//average Rating
ProductSchema.virtual('averageRating').get(function(){
    let totalRatings = 0;
    this?.reviews?.forEach(review => {
        totalRatings += review?.rating; 
    });

    const averageRating = Number(totalRatings / this?.reviews?.length).toFixed(1);
    return averageRating
})

const Product = mongoose.model("Product", ProductSchema);

export default Product;