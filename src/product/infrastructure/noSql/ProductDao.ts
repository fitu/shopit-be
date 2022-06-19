import { omit } from "lodash";
import mongoose, { Document } from "mongoose";

import { USER_SCHEMA } from "../../../user/infrastructure/noSql/UserDao";
import Product, { ProductCategory } from "../../domain/Product";

const PRODUCT_SCHEMA = "Product";

interface ProductDao {
    _id?: string;
    title: string;
    description: string;
    price: number;
    ratings: number;
    imageUrl: string;
    category: ProductCategory;
    stock: number;
    userId: string;
}

interface ProductDocument extends Document {
    toModel: () => Product;
}

type ProductFullDocument = ProductDao & ProductDocument;

const productSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
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
        type: String,
        ref: USER_SCHEMA,
        required: true,
    },
});

productSchema.methods.toModel = function (): Product {
    const product = this as ProductFullDocument;

    return {
        id: product.id.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        ratings: product.ratings,
        imageUrl: product.imageUrl,
        category: product.category,
        stock: product.stock,
    };
};

const fromProductToDao = (product: Product, userId: string): ProductDao => {
    const _id = product.id;
    const productWithoutId = omit(product, "id");

    return {
        _id,
        userId: userId,
        ...productWithoutId,
    };
};

const model = mongoose.model<ProductFullDocument>(PRODUCT_SCHEMA, productSchema);

export type { ProductDao };
export { PRODUCT_SCHEMA, fromProductToDao };
export default model;
