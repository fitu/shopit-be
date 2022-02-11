import Page, { DEFAULT_ITEMS_PER_PAGE } from "../../../shared/Page";
import UserDao from "../../../user/infrastructure/sql/UserDao";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDao from "./ProductDao";

class ProductRepository implements Repository {
    public async create(product: Product, userId: string): Promise<Product> {
        const newProduct = await ProductDao.create({
            ...(product.id && { id: product.id }),
            title: product.title,
            description: product.description,
            price: product.price,
            ratings: product.ratings,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
        });

        const user = await UserDao.findByPk(userId);
        await user.setProducts([newProduct]);

        return newProduct.toModel();
    }

    public async createBulk(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsToSave = products.map((product) => {
            return {
                ...(product.id && { id: product.id }),
                title: product.title,
                description: product.description,
                price: +product.price,
                ratings: +product.ratings,
                imageUrl: product.imageUrl,
                category: product.category,
                stock: +product.stock,
            };
        });

        const newProducts = await ProductDao.bulkCreate(productsToSave);

        const usersWithProductsPromises = userIds.map(async (userId, index) => {
            const user = await UserDao.findByPk(userId);
            await user.setProducts([newProducts[index]]);
        });
        await Promise.all(usersWithProductsPromises);

        return newProducts.map((newProduct) => newProduct.toModel());
    }

    public async update(product: Product, userId: string): Promise<Product> {
        return new Promise(() => {});
    }

    public async getAllProducts(page?: number, itemsPerPage?: number): Promise<Page<Array<Product>>> {
        const currentPage = page ? page : 1;
        const currentItemsPerPage = itemsPerPage ? itemsPerPage : DEFAULT_ITEMS_PER_PAGE;

        const allProductsWithCount = await ProductDao.findAndCountAll({
            limit: currentItemsPerPage,
            offset: (currentPage - 1) * currentItemsPerPage,
        });

        const productModels = allProductsWithCount.rows.map((product) => product.toModel());
        const totalDocuments = allProductsWithCount.count;

        return new Page<Array<Product>>({
            data: productModels,
            currentPage: currentPage,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: currentItemsPerPage,
        });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        const product = await ProductDao.findByPk(productId);
        return product;
    }

    public async deleteProductById(productId: string): Promise<void> {
        const productToDelete = await ProductDao.findByPk(productId);
        await productToDelete.destroy();
    }

    public async updateProductById(productId: string, product: Product): Promise<Product> {
        const updatedProduct = await ProductDao.findByPk(productId);

        if (!updatedProduct) {
            return null;
        }

        updatedProduct.update({
            title: product.title,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
        });

        return updatedProduct;
    }
}

export type { Repository };
export default ProductRepository;
