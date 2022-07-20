import { isNil } from "lodash";

import Product, { ProductCategory } from "@product/domain/Product";

class ProductData {
    readonly id?: string;
    readonly title: string;
    readonly description: string;
    readonly price: number;
    readonly imageUrl: string;
    readonly category: ProductCategory;
    readonly stock?: number;
    readonly ratings?: number;

    constructor({
        id,
        title,
        description,
        price,
        imageUrl,
        category,
        stock,
        ratings,
    }: {
        id?: string | null;
        title: string;
        description: string;
        price: number;
        imageUrl: string;
        category: ProductCategory;
        stock?: number;
        ratings?: number;
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.stock = stock ?? 0;
        this.ratings = ratings ?? 0;
    }

    public static fromModel(product: Product): ProductData {
        const productData = new ProductData({
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
            ratings: product.ratings,
        });

        return productData;
    }

    public static filterNulls(productData: ProductData): ProductData {
        Object.keys(productData).forEach((key) => {
            if (isNil(productData[key])) {
                delete productData[key];
            }
        });

        return productData;
    }
}

export default ProductData;
