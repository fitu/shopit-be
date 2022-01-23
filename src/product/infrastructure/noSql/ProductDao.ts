import mongoose, { Document, Types, Schema } from "mongoose";

import Product, { ProductCategory } from "../../domain/Product";

interface ProductDao {
    _id?: string;
    title: string;
    description: string;
    price: number;
    ratings: number;
    imageUrl: string;
    category: ProductCategory;
    stock: number;
    userId: Types.ObjectId;
}

interface ProductDocument extends Document {
    toModel: () => Product;
}

type ProductFullDocument = ProductDao & ProductDocument;

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
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

productSchema.methods.toModel = function (): Product {
    const product = this as ProductFullDocument;

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

const model = mongoose.model<ProductFullDocument>("Product", productSchema);

export type { ProductDao };
export default model;
