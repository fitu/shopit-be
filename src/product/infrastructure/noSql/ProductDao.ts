import mongoose, { Document } from "mongoose";

import Product, { ProductCategory } from "../../domain/Product";

interface ProductDocument extends Document {
    title: string;
    description: string;
    price: number;
    ratings: number;
    imageUrl: string;
    category: ProductCategory;
    stock: number;
    toModel: () => Product;
}

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
    const product = this as ProductDocument;

    return {
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        ratings: product.ratings,
        imageUrl: product.imageUrl,
        category: product.category,
        stock: product.stock,
    };
};

const model = mongoose.model<ProductDocument>("Product", schema);

export type { ProductDocument };
export default model;
