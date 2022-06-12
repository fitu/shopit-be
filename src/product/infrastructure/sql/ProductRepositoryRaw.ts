import { isEmpty } from "lodash";
import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { wasDeletionSuccessful } from "../../../shared/utils/sqlUtils";
import Page from "../../../shared/Page";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDao, { PRODUCT_TABLE } from "./ProductDao";

class ProductRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const products = await this.instance.query(
            `
                SELECT *
                FROM ${PRODUCT_TABLE}
                LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};
            `,
            {
                model: ProductDao,
                mapToModel: true,
            }
        );

        const productModels = products.map((product) => product.toModel());
        const totalDocuments = products.length;

        return new Page<Array<Product>>({
            data: productModels,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        const products = await this.instance.query(
            `
                SELECT *
                FROM ${PRODUCT_TABLE}
                WHERE id = '${productId}';
            `,
            {
                model: ProductDao,
                mapToModel: true,
            }
        );

        return !isEmpty(products) ? products.map((product) => product.toModel())[0] : null;
    }

    public async insert(product: Product, userId: string): Promise<Product> {
        const productId = product.id || uuidv4();

        await this.instance.query(
            `
                INSERT INTO ${PRODUCT_TABLE} (
                    id,
                    title,
                    description,
                    price,
                    ratings,
                    "imageUrl",
                    category,
                    stock,
                    "createdAt",
                    "updatedAt",
                    "userId"
                )
                VALUES (
                    :id,
                    :title,
                    :description,
                    :price,
                    :ratings,
                    :imageUrl,
                    :category,
                    :stock,
                    :createdAt,
                    :updatedAt,
                    :userId
                );
            `,
            {
                replacements: {
                    id: productId,
                    title: product.title,
                    description: product.description,
                    price: +product.price,
                    ratings: +product.ratings,
                    imageUrl: product.imageUrl,
                    category: product.category,
                    stock: +product.stock,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    userId,
                },
            }
        );

        return { ...product, id: productId };
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsWithUserIdsPromises = products
            .map((product, index) => [product, userIds[index]])
            .map(async (productWithUserId) => {
                const product = productWithUserId[0] as Product;
                const userId = productWithUserId[1] as string;
                return this.insert(product, userId);
            });

        return await Promise.all(productsWithUserIdsPromises);
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        const [_, metadata] = await this.instance.query(
            `
                DELETE FROM ${PRODUCT_TABLE}
                WHERE id = '${productId}';
            `
        );

        return wasDeletionSuccessful(metadata);
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        await this.instance.query(
            `
                UPDATE ${PRODUCT_TABLE}
                SET 
                    title = :title,
                    description = :description,
                    price = :price,
                    ratings = :ratings,
                    "imageUrl" = :imageUrl,
                    category = :category,
                    stock = :stock,
                    "createdAt" = :createdAt,
                    "updatedAt" = :updatedAt,
                    "userId" = :userId
                WHERE id = '${productId}';
            `,
            {
                replacements: {
                    title: product.title,
                    description: product.description,
                    price: +product.price,
                    ratings: +product.ratings,
                    imageUrl: product.imageUrl,
                    category: product.category,
                    stock: +product.stock,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    userId: product.user.id,
                },
            }
        );

        return product;
    }
}

export default ProductRepositoryRaw;
