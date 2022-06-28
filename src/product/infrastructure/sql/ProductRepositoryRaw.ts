import { isEmpty } from "lodash";
import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { wasDeletionSuccessful } from "../../../shared/utils/sqlUtils";
import Page from "../../../shared/Page";
import Product from "../../domain/Product";
import User from "../../../user/domain/User";
import { USER_ID, USER_TABLE } from "../../../user/infrastructure/sql/UserDao";
import { Repository } from "../Repository";

import ProductDao, {
    PRODUCT_TABLE,
    PRODUCT_ID,
    PRODUCT_TITLE,
    PRODUCT_DESCRIPTION,
    PRODUCT_PRICE,
    PRODUCT_RATINGS,
    PRODUCT_IMAGE_URL,
    PRODUCT_CATEGORY,
    PRODUCT_STOCK,
    PRODUCT_CREATED_AT,
    PRODUCT_UPDATED_AT,
    PRODUCT_USER_ID,
} from "./ProductDao";

class ProductRepositoryRaw implements Repository {
    constructor(public instance: Sequelize) {}

    public async insert(product: Product, userId: string): Promise<Product> {
        const productId = product.id || uuidv4();

        await this.instance.query(
            `
                INSERT INTO "${PRODUCT_TABLE}" (
                    "${PRODUCT_ID}",
                    "${PRODUCT_TITLE}",
                    "${PRODUCT_DESCRIPTION}",
                    "${PRODUCT_PRICE}",
                    "${PRODUCT_RATINGS}",
                    "${PRODUCT_IMAGE_URL}",
                    "${PRODUCT_CATEGORY}",
                    "${PRODUCT_STOCK}",
                    "${PRODUCT_CREATED_AT}",
                    "${PRODUCT_UPDATED_AT}",
                    "${PRODUCT_USER_ID}"
                )
                VALUES (
                    :${PRODUCT_ID},
                    :${PRODUCT_TITLE},
                    :${PRODUCT_DESCRIPTION},
                    :${PRODUCT_PRICE},
                    :${PRODUCT_RATINGS},
                    :${PRODUCT_IMAGE_URL},
                    :${PRODUCT_CATEGORY},
                    :${PRODUCT_STOCK},
                    :${PRODUCT_CREATED_AT},
                    :${PRODUCT_UPDATED_AT},
                    :${PRODUCT_USER_ID}
                );
            `,
            {
                replacements: {
                    [PRODUCT_ID]: productId,
                    [PRODUCT_TITLE]: product.title,
                    [PRODUCT_DESCRIPTION]: product.description,
                    [PRODUCT_PRICE]: +product.price,
                    [PRODUCT_RATINGS]: +product.ratings,
                    [PRODUCT_IMAGE_URL]: product.imageUrl,
                    [PRODUCT_CATEGORY]: product.category,
                    [PRODUCT_STOCK]: +product.stock,
                    [PRODUCT_CREATED_AT]: new Date().toISOString(),
                    [PRODUCT_UPDATED_AT]: new Date().toISOString(),
                    [PRODUCT_USER_ID]: userId,
                },
            }
        );

        const newProduct = new Product({ ...product, id: productId });

        return newProduct;
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

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        await this.instance.query(
            `
                UPDATE "${PRODUCT_TABLE}"
                SET 
                    "${PRODUCT_ID}" = :${PRODUCT_ID},
                    "${PRODUCT_TITLE}" = :${PRODUCT_TITLE},
                    "${PRODUCT_DESCRIPTION}" = :${PRODUCT_DESCRIPTION},
                    "${PRODUCT_PRICE}" = :${PRODUCT_PRICE},
                    "${PRODUCT_RATINGS}" = :${PRODUCT_RATINGS},
                    "${PRODUCT_IMAGE_URL}" = :${PRODUCT_IMAGE_URL},
                    "${PRODUCT_CATEGORY}" = :${PRODUCT_CATEGORY},
                    "${PRODUCT_STOCK}" = :${PRODUCT_STOCK},
                    "${PRODUCT_CREATED_AT}" = :${PRODUCT_CREATED_AT},
                    "${PRODUCT_UPDATED_AT}" = :${PRODUCT_UPDATED_AT},
                    "${PRODUCT_USER_ID}" = :${PRODUCT_USER_ID}
                WHERE "${PRODUCT_ID}" = '${productId}';
            `,
            {
                replacements: {
                    [PRODUCT_ID]: productId,
                    [PRODUCT_TITLE]: product.title,
                    [PRODUCT_DESCRIPTION]: product.description,
                    [PRODUCT_PRICE]: +product.price,
                    [PRODUCT_RATINGS]: +product.ratings,
                    [PRODUCT_IMAGE_URL]: product.imageUrl,
                    [PRODUCT_CATEGORY]: product.category,
                    [PRODUCT_STOCK]: +product.stock,
                    [PRODUCT_CREATED_AT]: new Date().toISOString(),
                    [PRODUCT_UPDATED_AT]: new Date().toISOString(),
                    [PRODUCT_USER_ID]: product?.user?.id,
                },
            }
        );

        return product;
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        const [_, metadata] = await this.instance.query(
            `
                DELETE FROM "${PRODUCT_TABLE}"
                WHERE "${PRODUCT_ID}" = '${productId}';
            `
        );

        return wasDeletionSuccessful(metadata);
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const products = await this.instance.query(
            `
                SELECT *
                FROM "${PRODUCT_TABLE}"
                LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};
            `,
            {
                model: ProductDao,
                mapToModel: true,
            }
        );

        const productModels: Array<Product> = products.map((product) => product.toModel());

        return new Page<Array<Product>>({
            data: productModels,
            currentPage: page,
            totalNumberOfDocuments: products.length,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const [products] = await this.instance.query(
            `
                SELECT *
                FROM "${PRODUCT_TABLE}" AS p
                JOIN "${USER_TABLE}" AS u
                ON p."${PRODUCT_USER_ID}" = u."${USER_ID}"
                LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};
            `
        );

        const productsWithUser = products.map((productWithUser: any) => {
            const user = new User({ ...productWithUser, id: productWithUser.userId });
            const product = new Product({ ...productWithUser, user });
            return product;
        });

        const totalDocuments = products.length;

        return new Page<Array<Product>>({
            data: productsWithUser,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        const [product] = await this.instance.query(
            `
                SELECT *
                FROM "${PRODUCT_TABLE}"
                WHERE "${PRODUCT_ID}" = '${productId}';
            `,
            {
                model: ProductDao,
                mapToModel: true,
            }
        );

        if (isEmpty(product)) {
            return null;
        }

        return product.toModel();
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        const [productsWithUsers] = await this.instance.query(
            `
                SELECT *
                FROM "${PRODUCT_TABLE}" AS p
                JOIN "${USER_TABLE}" AS u
                ON p."${PRODUCT_USER_ID}" = u."${USER_ID}"
                WHERE p."${PRODUCT_ID}" = '${productId}';
            `
        );

        if (isEmpty(productsWithUsers)) {
            return null;
        }

        const productWithUser = productsWithUsers[0] as any;
        const user = new User({ ...productWithUser, id: productWithUser.userId });
        const product = new Product({ ...productWithUser, user });

        return product;
    }
}

export default ProductRepositoryRaw;
