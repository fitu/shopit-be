import Page from "../../../shared/Page";
import UserDao from "../../../user/infrastructure/sql/UserDao";
import Product from "../../domain/Product";
import { Repository } from "../Repository";

import ProductDao, { validateProductToInsert } from "./ProductDao";

class ProductRepository implements Repository {
    public async insert(product: Product, userId: string): Promise<Product> {
        const productToInsert = validateProductToInsert(product);
        const newProduct = await ProductDao.create(productToInsert);

        const user = await UserDao.findByPk(userId);
        const userProduct = [newProduct];
        await user.setProducts(userProduct);

        return newProduct.toModel();
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsToSave = products.map((product) => validateProductToInsert(product));
        const newProducts = await ProductDao.bulkCreate(productsToSave);

        const usersWithProductsPromises = userIds.map(async (userId, index) => {
            const user = await UserDao.findByPk(userId);
            const userProduct = [newProducts[index]];
            await user.setProducts(userProduct);
        });
        await Promise.all(usersWithProductsPromises);

        return newProducts.map((newProduct) => newProduct.toModel());
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        const productToUpdate = await ProductDao.findByPk(productId);

        if (!productToUpdate) {
            return null;
        }

        const productToSave = validateProductToInsert(product);
        const updatedProduct = await productToUpdate.update(productToSave);

        return updatedProduct.toModel();
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        const productToDelete = await ProductDao.findByPk(productId);

        if (!productToDelete) {
            return false;
        }

        await productToDelete.destroy();
        return true;
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const allProductsWithCount = await ProductDao.findAndCountAll({
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
        });

        const productModels = allProductsWithCount.rows.map((product) => product.toModel());
        const totalDocuments = allProductsWithCount.count;

        return new Page<Array<Product>>({
            data: productModels,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const allProductsWithCount = await ProductDao.findAndCountAll({
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
        });

        const productModelsPromises = allProductsWithCount.rows.map(async (product) => {
            const productOwner = await product.getUser();
            return { ...product.toModel(), user: productOwner.toModel() };
        });
        const productModels = await Promise.all(productModelsPromises);
        const totalDocuments = allProductsWithCount.count;

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

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        const product = await ProductDao.findByPk(productId);

        if (!product) {
            return null;
        }

        const productOwner = await product.getUser();
        const productWithUser = { ...product.toModel(), user: productOwner.toModel() };

        return productWithUser;
    }
}

export default ProductRepository;
