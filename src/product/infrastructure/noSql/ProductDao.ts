import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
    stock: {
        type: Number,
        required: true,
    },
});

export default productSchema;
