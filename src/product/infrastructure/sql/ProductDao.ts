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
const PRODUCT_ID = "id";
const PRODUCT_TITLE = "title";
const PRODUCT_DESCRIPTION = "description";
const PRODUCT_PRICE = "price";
const PRODUCT_RATINGS = "ratings";
const PRODUCT_IMAGE_URL = "imageUrl";
const PRODUCT_CATEGORY = "category";
const PRODUCT_STOCK = "stock";
const PRODUCT_CREATED_AT = "createdAt";
const PRODUCT_UPDATED_AT = "updatedAt";
const PRODUCT_REVIEWS = "reviews";
const PRODUCT_USER = "user";
const PRODUCT_USER_ID = "userId";

interface ProductAttributes {
    [PRODUCT_ID]: string;
    [PRODUCT_TITLE]: string;
    [PRODUCT_DESCRIPTION]: string;
    [PRODUCT_PRICE]: number;
    [PRODUCT_RATINGS]: number;
    [PRODUCT_IMAGE_URL]: string;
    [PRODUCT_CATEGORY]: ProductCategory;
    [PRODUCT_STOCK]: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class ProductDao extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public [PRODUCT_ID]!: string;
    public [PRODUCT_TITLE]!: string;
    public [PRODUCT_DESCRIPTION]!: string;
    public [PRODUCT_PRICE]!: number;
    public [PRODUCT_RATINGS]!: number;
    public [PRODUCT_IMAGE_URL]!: string;
    public [PRODUCT_CATEGORY]!: ProductCategory;
    public [PRODUCT_STOCK]!: number;

    public readonly [PRODUCT_CREATED_AT]!: Date;
    public readonly [PRODUCT_UPDATED_AT]!: Date;

    // public readonly cartItems?: Array<CartItemDao>;
    // public readonly orderItems?: Array<OrderItemDao>;
    public readonly [PRODUCT_REVIEWS]?: Array<ReviewDao>;
    public readonly [PRODUCT_USER]?: UserDao;

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
            [PRODUCT_ID]: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            [PRODUCT_TITLE]: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            [PRODUCT_DESCRIPTION]: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            [PRODUCT_PRICE]: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0.0,
            },
            [PRODUCT_RATINGS]: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            [PRODUCT_IMAGE_URL]: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            [PRODUCT_CATEGORY]: {
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
            [PRODUCT_STOCK]: {
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

export {
    init,
    validateProductToInsert,
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
    PRODUCT_REVIEWS,
    PRODUCT_USER,
    PRODUCT_USER_ID,
};
export default ProductDao;
