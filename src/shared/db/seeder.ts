import ProductService from "@product/domain/ProductService";
import ReviewService from "@review/domain/ReviewService";
import ShippingInfoService from "@shippingInfo/domain/ShippingInfoService";
import UserService from "@user/domain/UserService";
import { DbType } from "@shared/db/database";
import InMemorySeeder from "@shared/db/inMemory/InMemorySeeder";
import NoSqlSeeder from "@shared/db/noSql/NoSqlSeeder";
import SqlSeeder from "@shared/db/sql/SqlSeeder";

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

    return new InMemorySeeder({ userService, shippingInfoService, productService, reviewService });
};

export { getSeeder };
export default Seeder;
