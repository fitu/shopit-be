import ProductService from "@product/domain/ProductService";
import ReviewService from "@review/domain/ReviewService";
import ShippingInfoService from "@shippingInfo/domain/ShippingInfoService";
import UserService from "@user/domain/UserService";
import { readFromCsv } from "@shared/data/csvUtils";
import Seeder from "@shared/db/seeder";

const PRODUCTS_CSV_PATH = "src/modules/product/infrastructure/data/products.csv";
const REVIEWS_CSV_PATH = "src/modules/review/infrastructure/data/reviews.csv";
const SHIPPINGS_INFO_CSV_PATH = "src/modules/shippingInfo/infrastructure/data/shippingsInfo.csv";
const USERS_CSV_PATH = "src/modules/user/infrastructure/data/users.csv";

class InMemorySeeder implements Seeder {
    private userService: UserService;
    private shippingInfoService: ShippingInfoService;
    private productService: ProductService;
    private reviewService: ReviewService;

    constructor({
        userService,
        shippingInfoService,
        productService,
        reviewService,
    }: {
        userService: UserService;
        shippingInfoService: ShippingInfoService;
        productService: ProductService;
        reviewService: ReviewService;
    }) {
        this.userService = userService;
        this.shippingInfoService = shippingInfoService;
        this.productService = productService;
        this.reviewService = reviewService;
    }

    public seed = async (): Promise<void> => {
        await this.createUsers();
        await this.createShippingsInfo();
        await this.createProducts();
        await this.createReviews();
    };

    private createUsers = async (): Promise<void> => {
        return Promise.resolve();
    };

    private createShippingsInfo = async (): Promise<void> => {
        return Promise.resolve();
    };

    private createProducts = async (): Promise<void> => {
        return Promise.resolve();
    };

    private createReviews = async (): Promise<void> => {
        return Promise.resolve();
    };
}

export default InMemorySeeder;
