import ProductService from "@product/domain/ProductService";
import ReviewService from "@review/domain/ReviewService";
import ShippingInfoService from "@shippingInfo/domain/ShippingInfoService";
import UserService from "@user/domain/UserService";
import { DbType } from "@shared/db/database";
import InMemorySeeder from "@shared/db/inMemory/InMemorySeeder";
import NoSqlSeeder from "@shared/db/noSql/NoSqlSeeder";
import SqlSeeder from "@shared/db/sql/SqlSeeder";

const USERS_CSV_PATH = "src/modules/user/infrastructure/data/users.csv";
const PRODUCTS_CSV_PATH = "src/modules/product/infrastructure/data/products.csv";
const REVIEWS_CSV_PATH = "src/modules/review/infrastructure/data/reviews.csv";
const SHIPPINGS_INFO_CSV_PATH = "src/modules/shippingInfo/infrastructure/data/shippingsInfo.csv";

interface Seeder {
    seed: () => Promise<void>;
}

const getSeeder = (
    dbType: string,
    userService: UserService,
    shippingInfoService: ShippingInfoService,
    productService: ProductService,
    reviewService: ReviewService
): Seeder => {
    if (dbType === DbType.SQL.toString()) {
        return new SqlSeeder({ userService, shippingInfoService, productService, reviewService });
    }

    if (dbType === DbType.NO_SQL.toString()) {
        return new NoSqlSeeder({ userService, productService, reviewService });
    }

    return new InMemorySeeder({ userService, productService, reviewService });
};

export { getSeeder, USERS_CSV_PATH, PRODUCTS_CSV_PATH, REVIEWS_CSV_PATH, SHIPPINGS_INFO_CSV_PATH };
export default Seeder;
