import {
    Model,
    DataTypes,
    Optional,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasOneGetAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasOneSetAssociationMixin,
    Sequelize,
} from "sequelize";

import ReviewDao from "../../../review/infrastructure/sql/ReviewDao";
import UserDao from "../../../user/infrastructure/sql/UserDao";
import Product, { ProductCategory } from "../../domain/Product";

const PRODUCT_TABLE = "products";

interface ProductAttributes {
    id: string;
    title: string;
    description: string;
    price: number;
    ratings: number;
    imageUrl: string;
    category: ProductCategory;
    stock: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class ProductDao extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: string;
    public title!: string;
    public description!: string;
    public price!: number;
    public ratings!: number;
    public imageUrl!: string;

    public category!: ProductCategory;
    public stock!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // public readonly cartItems?: Array<CartItemDao>;
    // public readonly orderItems?: Array<OrderItemDao>;
    public readonly reviews?: Array<ReviewDao>;
    public readonly user?: UserDao;

    // public getCartItems!: HasManyGetAssociationsMixin<CartItemDao>;
    // public addCartItems!: HasManyAddAssociationMixin<CartItemDao, number>;
    // public hasCartItems!: HasManyHasAssociationMixin<CartItemDao, number>;
    // public setCartItems!: HasManySetAssociationsMixin<CartItemDao, number>;
    // public countCartItems!: HasManyCountAssociationsMixin;

    // public getOrderItems!: HasManyGetAssociationsMixin<OrderItemDao>;
    // public addOrderItems!: HasManyAddAssociationMixin<OrderItemDao, number>;
    // public hasOrderItems!: HasManyHasAssociationMixin<OrderItemDao, number>;
    // public setOrderItems!: HasManySetAssociationsMixin<OrderItemDao, number>;
    // public countOrderItems!: HasManyCountAssociationsMixin;

    public getReviews!: HasManyGetAssociationsMixin<ReviewDao>;
    public addReviews!: HasManyAddAssociationMixin<ReviewDao, number>;
    public hasReviews!: HasManyHasAssociationMixin<ReviewDao, number>;
    public setReviews!: HasManySetAssociationsMixin<ReviewDao, number>;
    public countReviews!: HasManyCountAssociationsMixin;

    public getUser!: HasOneGetAssociationMixin<UserDao>;
    public setUser!: HasOneSetAssociationMixin<UserDao, number>;

    public toModel(): Product {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            price: this.price,
            ratings: this.ratings,
            imageUrl: this.imageUrl,
            category: this.category,
            stock: this.stock,
        };
    }
}

const init = (sequelize: Sequelize): void => {
    ProductDao.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0.0,
            },
            ratings: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    // TODO: get from model
                    isIn: [
                        [
                            "Electronics",
                            "Cameras",
                            "Laptops",
                            "Accessories",
                            "Headphones",
                            "Food",
                            "Books",
                            "Clothes/Shoes",
                            "Beauty/Health",
                            "Sports",
                            "Outdoor",
                            "Home",
                        ],
                    ],
                },
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    max: 100,
                },
            },
        },
        {
            tableName: PRODUCT_TABLE,
            sequelize,
        }
    );
};

const validateProductToInsert = (product: Product): Product => ({
    ...(product.id && { id: product.id }),
    title: product.title,
    description: product.description,
    price: +product.price,
    ratings: +product.ratings,
    imageUrl: product.imageUrl,
    category: product.category,
    stock: +product.stock,
});

export { init, PRODUCT_TABLE, validateProductToInsert };
export default ProductDao;
