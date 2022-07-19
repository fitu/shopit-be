import { zip } from "lodash";

import ProductCSV from "@product/infrastructure/data/ProductCSV";
import ShippingInfo from "@shippingInfo/domain/ShippingInfo";
import ReviewCSV from "@review/infrastructure/data/ReviewCSV";
import ShippingInfoCSV from "@shippingInfo/infrastructure/data/ShippingInfoCSV";
import UserCSV from "@user/infrastructure/data/UserCSV";
import ProductService from "@product/domain/ProductService";
import ReviewService from "@review/domain/ReviewService";
import UserService from "@user/domain/UserService";
import { readFromCsv } from "@shared/data/csvUtils";
import Seeder, {
    USERS_CSV_PATH,
    PRODUCTS_CSV_PATH,
    REVIEWS_CSV_PATH,
    SHIPPINGS_INFO_CSV_PATH,
} from "@shared/db/seeder";

class InMemorySeeder implements Seeder {
    private userService: UserService;
    private productService: ProductService;
    private reviewService: ReviewService;

    constructor({
        userService,
        productService,
        reviewService,
    }: {
        userService: UserService;
        productService: ProductService;
        reviewService: ReviewService;
    }) {
        this.userService = userService;
        this.productService = productService;
        this.reviewService = reviewService;
    }

    public seed = async (): Promise<void> => {
        await this.createUsers();
        // await this.createProducts();
        // await this.createReviews();
    };

    private createUsers = async (): Promise<void> => {
        const usersCSV = await readFromCsv<UserCSV>(USERS_CSV_PATH);
        const users = usersCSV.map((userCSV) => UserCSV.toModel(userCSV));

        const shippingsInfoCSV = await readFromCsv<ShippingInfoCSV>(SHIPPINGS_INFO_CSV_PATH);
        const shippingsInfo = shippingsInfoCSV.map((shippingInfoCSV) => ShippingInfoCSV.toModel(shippingInfoCSV));
        const userIdsInShippingInfo = shippingsInfoCSV.map((shippingInfoCSV) => shippingInfoCSV.userId);
        const shippingInfoWithUserIds: Array<[ShippingInfo, string]> = zip(shippingsInfo, userIdsInShippingInfo);

        const usersWithShippingInfo = users.map((user) => {
            const shippingInfosOfUser = shippingInfoWithUserIds.filter(([_, userId]) => userId === user.id);
            if (!shippingInfosOfUser) {
                return user;
            }

            const userShippingsInfo = shippingInfosOfUser.map(([shippingInfo, _]) => shippingInfo);

            return { ...user, shippingsInfo: userShippingsInfo };
        });

        await this.userService.insertBatch(usersWithShippingInfo);
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

export default InMemorySeeder;
