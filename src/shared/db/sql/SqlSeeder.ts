import ProductCSV from "@product/infrastructure/data/ProductCSV";
import ReviewCSV from "@review/infrastructure/data/ReviewCSV";
import ShippingInfoCSV from "@shippingInfo/infrastructure/data/ShippingInfoCSV";
import UserCSV from "@user/infrastructure/data/UserCSV";
import ProductService from "@product/domain/ProductService";
import ReviewService from "@review/domain/ReviewService";
import ShippingInfoService from "@shippingInfo/domain/ShippingInfoService";
import UserService from "@user/domain/UserService";
import { readFromCsv } from "@shared/data/csvUtils";
import Seeder, {
    USERS_CSV_PATH,
    PRODUCTS_CSV_PATH,
    REVIEWS_CSV_PATH,
    SHIPPINGS_INFO_CSV_PATH,
} from "@shared/db/seeder";

class SqlSeeder implements Seeder {
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
        const usersCSV = await readFromCsv<UserCSV>(USERS_CSV_PATH);
        const users = usersCSV.map((userCSV) => UserCSV.toModel(userCSV));
        await this.userService.insertBatch(users);
    };

    private createShippingsInfo = async (): Promise<void> => {
        const shippingsInfoCSV = await readFromCsv<ShippingInfoCSV>(SHIPPINGS_INFO_CSV_PATH);
        const shippingsInfo = shippingsInfoCSV.map((shippingInfoCSV) => ShippingInfoCSV.toModel(shippingInfoCSV));
        const userIds = shippingsInfoCSV.map((shippingInfoCSV) => shippingInfoCSV.userId);
        await this.shippingInfoService.insertBatch(shippingsInfo, userIds);
    };

    private createProducts = async (): Promise<void> => {
        const productsCSV = await readFromCsv<ProductCSV>(PRODUCTS_CSV_PATH);
        const products = productsCSV.map((productCSV) => ProductCSV.toModel(productCSV));
        const userIds = productsCSV.map((productCSV) => productCSV.userId);
        await this.productService.insertBatch(products, userIds);
    };

    private createReviews = async (): Promise<void> => {
        const reviewsCSV = await readFromCsv<ReviewCSV>(REVIEWS_CSV_PATH);
        const reviews = reviewsCSV.map((reviewCSV) => ReviewCSV.toModel(reviewCSV));
        const productIds = reviewsCSV.map((reviewCSV) => reviewCSV.productId);
        const userIds = reviewsCSV.map((reviewCSV) => reviewCSV.userId);
        await this.reviewService.insertBatch(reviews, productIds, userIds);
    };
}

export default SqlSeeder;
