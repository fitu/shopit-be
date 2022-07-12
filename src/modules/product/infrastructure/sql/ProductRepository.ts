import Page from "@shared/Page";
import UserDao from "@user/infrastructure/sql/UserDao";
import Product from "@product/domain/Product";
import { Repository } from "@product/infrastructure/Repository";

import ProductDao, { validateProductFieldsToInsert } from "./ProductDao";

class ProductRepository implements Repository {
    public async insert(product: Product, userId: string): Promise<Product> {
        const productToInsert: Product = validateProductFieldsToInsert(product);
        const newProduct: ProductDao = await ProductDao.create(productToInsert);

        const user: UserDao = await UserDao.findByPk(userId);
        const userProduct: Array<ProductDao> = [newProduct];
        await user.setProducts(userProduct);

        const newProductModel = newProduct.toModel();
        return newProductModel;
    }

    public async insertBatch(products: Array<Product>, userIds: Array<string>): Promise<Array<Product>> {
        const productsToSave: Array<Product> = products.map((product) => validateProductFieldsToInsert(product));
        const newProducts: Array<ProductDao> = await ProductDao.bulkCreate(productsToSave);

        const usersWithProductsPromises = userIds.map(async (userId, index) => {
            const user: UserDao = await UserDao.findByPk(userId);
            const userProduct: Array<ProductDao> = [newProducts[index]];
            await user.setProducts(userProduct);
        });
        await Promise.all(usersWithProductsPromises);

        const newProductModels = newProducts.map((newProduct) => newProduct.toModel());
        return newProductModels;
    }

    public async updateProductById(productId: string, product: Product): Promise<Product | null> {
        const productToUpdate: ProductDao = await ProductDao.findByPk(productId);

        if (!productToUpdate) {
            return null;
        }

        const productToSave: Product = validateProductFieldsToInsert(product);
        const updatedProduct: ProductDao = await productToUpdate.update(productToSave);

        const updatedProductModel = updatedProduct.toModel();
        return updatedProductModel;
    }

    public async deleteProductById(productId: string): Promise<boolean> {
        const productToDelete: ProductDao = await ProductDao.findByPk(productId);

        if (!productToDelete) {
            return false;
        }

        await productToDelete.destroy();

        return true;
    }

    public async getAllProducts(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const allProductsWithMetadata = await ProductDao.findAndCountAll({
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
        });

        const productModels: Array<Product> = allProductsWithMetadata.rows.map((product) => product.toModel());
        const totalDocuments: number = allProductsWithMetadata.count;

        return new Page<Array<Product>>({
            data: productModels,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getAllProductsWithUsers(page: number, itemsPerPage: number): Promise<Page<Array<Product>>> {
        const allProductsWithMetadata = await ProductDao.findAndCountAll({
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
        });

        const productModelsPromises = allProductsWithMetadata.rows.map(async (product) => {
            const productOwner = await product.getUser();
            return { ...product.toModel(), user: productOwner.toModel() };
        });
        const products: Array<Product> = await Promise.all(productModelsPromises);
        const totalDocuments: number = allProductsWithMetadata.count;

        return new Page<Array<Product>>({
            data: products,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getProductById(productId: string): Promise<Product | null> {
        const productDao: ProductDao = await ProductDao.findByPk(productId);
        
        const product = productDao?.toModel();
        return product;
    }

    public async getProductWithUserById(productId: string): Promise<Product | null> {
        const product: ProductDao = await ProductDao.findByPk(productId);

        if (!product) {
            return null;
        }

        const productOwner: UserDao = await product.getUser();
        
        const productWithUser: Product = { ...product.toModel(), user: productOwner.toModel() };
        return productWithUser;
    }
}

export default ProductRepository;
