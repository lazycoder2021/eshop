const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product Name is required"],
            trim: true,
        },
        productImage: {
            type: String,
            required: [true, "Image is required"],
        },
        brand: {
            type: String,
            required: [true, "Brand is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        countInStock: {
            type: Number,
            default: 0,
            required: [true, "Product Stock is required"],
        },
        description: {
            type: String,
            //required: [true, "Description is required"],
            default: 'Description'
        },

        averageRating: {
            type: Number,
            min: [1, "Rating must be at least 1"],
            max: [10, "Rating must can not be more than 10"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: { virtuals: true },
    }
);


module.exports = mongoose.model("Product", ProductSchema);
