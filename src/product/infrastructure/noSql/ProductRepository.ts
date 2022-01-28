import { zip } from "lodash";
import { Types } from "mongoose";

import Page, { DEFAULT_ITEMS_PER_PAGE } from "../../../shared/Page";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDocument, { ProductDao } from "./ProductDao";

class ProductRepository implements Repository {
    public async create(product: Product, userId: string): Promise<Product> {
        const productToSave: ProductDao = { ...product, userId: new Types.ObjectId(userId) };
        const newProduct = await ProductDocument.create(productToSave);
        return newProduct.toModel();
    }

    public async createBulk(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsUsers: Array<[Product, string]> = zip(products, userIds);
        const productsToSave: Array<ProductDao> = productsUsers.map(([product, userId]) => ({
            ...product,
            userId: new Types.ObjectId(userId),
        }));
        const newProducts = await ProductDocument.insertMany(productsToSave);
        return newProducts.map((newProduct) => newProduct.toModel());
    }

    public async update(product: Product, userId: string): Promise<Product> {
        return new Promise(() => {});
    }

    public async getAllProducts(page?: number, itemsPerPage?: number): Promise<Page<Array<Product>>> {
        const currentPage = page ? page : 1;
        const currentItemsPerPage = itemsPerPage ? itemsPerPage : DEFAULT_ITEMS_PER_PAGE;

        const products = currentPage
            ? await ProductDocument.find()
                  .skip((currentPage - 1) * currentItemsPerPage)
                  .limit(currentItemsPerPage)
            : await ProductDocument.find();
        const productModels = products.map((product) => product.toModel());

        const totalDocuments = page ? await ProductDocument.countDocuments() : products.length;

        return new Page<Array<Product>>({
            data: productModels,
            currentPage: currentPage,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: currentItemsPerPage,
        });
    }

    public async getProductById(productId: string): Promise<Product> {
        return new Promise(() => {});
    }

    public async deleteProductById(productId: string): Promise<void> {
        return new Promise(() => {});
    }

    public async updateProductById(productId: string, product: Product): Promise<Product> {
        return new Promise(() => {});
    }
}

export default ProductRepository;
