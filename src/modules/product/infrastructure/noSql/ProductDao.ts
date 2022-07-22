import mongoose, { Document, Types } from "mongoose";

import { USER_SCHEMA } from "@user/infrastructure/noSql/UserDao";
import Product, { ProductCategory, validProductCategories } from "@product/domain/Product";
import { fromProductDocumentToModel } from "@product/infrastructure/noSql/productParsers";

const PRODUCT_SCHEMA = "Product";
const PRODUCT_DOCUMENT = "products";
// TODO: add "columns"

interface ProductDao {
    readonly _id?: Types.ObjectId;
    remoteId?: string;
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
    remoteId: {
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
            values: validProductCategories,
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
    return fromProductDocumentToModel(this);
};

const model = mongoose.model<ProductFullDocument>(PRODUCT_SCHEMA, productSchema);

export type { ProductDao, ProductFullDocument };
export { PRODUCT_SCHEMA, PRODUCT_DOCUMENT };
export default model;
