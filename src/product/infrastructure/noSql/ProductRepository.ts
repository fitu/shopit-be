import { zip } from "lodash";

import UserDocument, { UserFullDocument } from "../../../user/infrastructure/noSql/UserDao";
import Page from "../../../shared/Page";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDocument, { ProductFullDocument, ProductDao } from "./ProductDao";
import { fromProductToDao } from "./productParsers";

class ProductRepository implements Repository {
    public async insert(product: Product, userId: string): Promise<Product> {
        const productToSave: ProductDao = fromProductToDao(product, userId);

        const newProductDocument: ProductFullDocument = await ProductDocument.create(productToSave);

        return newProductDocument.toModel();
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsAndUserIds: Array<[Product, string]> = zip(products, userIds);
        const productsToSave: Array<ProductDao> = productsAndUserIds.map(([product, userId]) =>
            fromProductToDao(product, userId)
        );

        const insertedProductDocuments: Array<ProductFullDocument> = await ProductDocument.insertMany(productsToSave);
        const insertedProducts: Array<Product> = insertedProductDocuments.map((insertedProductDocument) =>
            insertedProductDocument.toModel()
        );

        return insertedProducts;
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        const oldProductDocument: ProductFullDocument = await ProductDocument.findOneAndUpdate(
            { remoteId: productId },
            product
        ).exec();

        if (!oldProductDocument) {
            return null;
        }

        return product;
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        const deletedProductDocument: ProductFullDocument = await ProductDocument.findOneAndDelete({
            remoteId: productId,
        }).exec();

        const success = !!deletedProductDocument;
        return success;
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const productDocuments: Array<ProductFullDocument> = await ProductDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const products: Array<Product> = productDocuments.map((productDocument) => productDocument.toModel());
        const totalDocuments: number = await ProductDocument.countDocuments();

        return new Page<Array<Product>>({
            data: products,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const productDocuments: Array<ProductFullDocument> = await ProductDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const productsWithUsersPromises = productDocuments.map(async (productDocument) => {
            const userDocument: UserFullDocument = await UserDocument.findOne({
                remoteId: productDocument.userId,
            }).exec();

            const productWithUser: Product = { ...productDocument.toModel(), user: userDocument.toModel() };
            return productWithUser;
        });

        const products: Array<Product> = await Promise.all(productsWithUsersPromises);
        const totalDocuments: number = await ProductDocument.countDocuments();

        return new Page<Array<Product>>({
            data: products,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        const productDocument: ProductFullDocument | null = await ProductDocument.findOne({
            remoteId: productId,
        }).exec();

        return productDocument?.toModel();
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        const productDocument: ProductFullDocument | null = await ProductDocument.findOne({
            remoteId: productId,
        }).exec();
        const userDocument: UserFullDocument | null = await UserDocument.findOne({
            remoteId: productDocument.userId,
        }).exec();

        if (!productDocument || !userDocument) {
            return null;
        }

        const productWithUser: Product = { ...productDocument.toModel(), user: userDocument.toModel() };
        return productWithUser;
    }
}

export default ProductRepository;
