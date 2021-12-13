import {
    Model,
    DataTypes,
    Optional,
    Association,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasOneGetAssociationMixin,
} from "sequelize";

import sequelize from "../utils/database";
import CartItem from "./cartItem";

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

    public getCartItem!: HasOneGetAssociationMixin<CartItem>;
    public addCartItems!: HasManyAddAssociationMixin<CartItem, number>;
    public hasCartItems!: HasManyHasAssociationMixin<CartItem, number>;

    public static associations: {
        cartItems: Association<Product, CartItem>;
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
