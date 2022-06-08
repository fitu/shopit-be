import { Sequelize } from "sequelize";

import Page from "../../../shared/Page";
import UserDao from "../../../user/infrastructure/sql/UserDao";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDao, { PRODUCT_TABLE} from "./ProductDao";

class ProductRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async create(product: Product, userId: string): Promise<Product> {
        return new Promise(() => {});
    }

    public async createBulk(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        return new Promise(() => {});
    }

    public async update(product: Product, userId: string): Promise<Product> {
        return new Promise(() => {});
    }

    // TODO: complete this
    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const products = await this.instance.query(
            `
                SELECT * FROM ${PRODUCT_TABLE}
                LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage}
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
        return ProductDao.findByPk(productId);
    }

    public async deleteProductById(productId: string): Promise<void> {
        return new Promise(() => {});
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        return new Promise(() => {});
    }
}

export default ProductRepositoryRaw;
