import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasOneGetAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasOneSetAssociationMixin,
} from "sequelize";

import sequelize from "../../shared/db/database";
import CartItem from "../../cartItem/domain/cartItem";
import OrderItem from "../../orderItem/domain/orderItem";
import Review from "../../review/domain/review";
import User from "../../user/domain/user";

type Category =
    | "Electronics"
    | "Cameras"
    | "Laptops"
    | "Accessories"
    | "Headphones"
    | "Food"
    | "Books"
    | "Clothes/Shoes"
    | "Beauty/Health"
    | "Sports"
    | "Outdoor"
    | "Home";

interface ProductAttributes {
    id: number;
    title: string;
    description: string | null;
    price: number;
    ratings: number;
    imageUrl: string;
    category: Category;
    stock: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public title!: string;
    public description!: string | null;
    public price!: number;
    public ratings!: number;
    public imageUrl!: string;
    public category!: Category;
    public stock!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getCartItems!: HasManyGetAssociationsMixin<CartItem>;
    public addCartItems!: HasManyAddAssociationMixin<CartItem, number>;
    public hasCartItems!: HasManyHasAssociationMixin<CartItem, number>;
    public setCartItems!: HasManySetAssociationsMixin<CartItem, number>;
    public countCartItems!: HasManyCountAssociationsMixin;

    public getOrderItems!: HasManyGetAssociationsMixin<OrderItem>;
    public addOrderItems!: HasManyAddAssociationMixin<OrderItem, number>;
    public hasOrderItems!: HasManyHasAssociationMixin<OrderItem, number>;
    public setOrderItems!: HasManySetAssociationsMixin<OrderItem, number>;
    public countOrderItems!: HasManyCountAssociationsMixin;

    public getReviews!: HasManyGetAssociationsMixin<Review>;
    public addReviews!: HasManyAddAssociationMixin<Review, number>;
    public hasReviews!: HasManyHasAssociationMixin<Review, number>;
    public setReviews!: HasManySetAssociationsMixin<Review, number>;
    public countReviews!: HasManyCountAssociationsMixin;

    public getUser!: HasOneGetAssociationMixin<User>;
    public setUser!: HasOneSetAssociationMixin<User, number>;

    public readonly cartItems?: Array<CartItem>;
    public readonly orderItems?: Array<OrderItem>;
    public readonly reviews?: Array<Review>;
    public readonly user?: User;

    public static associations: {
        cartItems: Association<Product, CartItem>;
        orderItems: Association<Product, OrderItem>;
        reviews: Association<Product, Review>;
        user: Association<Product, User>;
    };
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
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
        tableName: "product",
        sequelize,
    }
);

export default Product;
