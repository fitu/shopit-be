import mongoose from "mongoose";

import Product from "../../../product/domain/Product";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    ratings: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: {
            // TODO: remove hardcoded
            values: [
                "Electronics",
                "Cameras",
                "Laptops",
                "Accessories",
                "Headphones",
                "Food",
                "Books",
                "Clothes/Shoes",
                "Beauty/Health",
                "Sports",
                "Outdoor",
                "Home",
            ],
            message: "Please select correct category",
        },
    },
    stock: {
        type: Number,
        required: true,
    },
});

schema.methods.toModel = function (): Product {
    return {
        id: this._id.toString(),
        title: this.title,
        description: this.description,
        price: this.price,
        ratings: this.ratings,
        imageUrl: this.imageUrl,
        category: this.category,
        stock: this.stock,
    };
};

const model = mongoose.model("Product", schema);

export default model;
