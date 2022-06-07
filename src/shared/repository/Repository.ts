import { Repository as CartRepository } from "../../cart/infrastructure/Repository";
import { Repository as ProductRepository } from "../../product/infrastructure/Repository";
import { Repository as ReviewRepository } from "../../review/infrastructure/Repository";
import { Repository as ShippingInfoRepository } from "../../shippingInfo/infrastructure/Repository";
import { Repository as UserRepository } from "../../user/infrastructure/Repository";
import { Repository as EmailRepository } from "../integrations/emails/Repository";
import SqlCartRepository from "../../cart/infrastructure/sql/CartRepository";
import SqlProductRepository from "../../product/infrastructure/sql/ProductRepository";
import SqlReviewRepository from "../../review/infrastructure/sql/ReviewRepository";
import SqlShippingInfoRepository from "../../shippingInfo/infrastructure/sql/ShippingInfoRepository";
import SqlUserRepository from "../../user/infrastructure/sql/UserRepository";
import SqlCartRepositoryRaw from "../../cart/infrastructure/sql/CartRepositoryRaw";
import SqlProductRepositoryRaw from "../../product/infrastructure/sql/ProductRepositoryRaw";
import SqlReviewRepositoryRaw from "../../review/infrastructure/sql/ReviewRepositoryRaw";
import SqlShippingInfoRepositoryRaw from "../../shippingInfo/infrastructure/sql/ShippingInfoRepositoryRaw";
import SqlUserRepositoryRaw from "../../user/infrastructure/sql/UserRepositoryRaw";
import NoSqlProductRepository from "../../product/infrastructure/noSql/ProductRepository";
import NoSqlUserRepository from "../../user/infrastructure/noSql/UserRepository";
import NoSqlReviewRepository from "../../review/infrastructure/noSql/ReviewRepository";
import NoSqlProductRepositoryRaw from "../../product/infrastructure/noSql/ProductRepositoryRaw";
import NoSqlUserRepositoryRaw from "../../user/infrastructure/noSql/UserRepositoryRaw";
import NoSqlReviewRepositoryRaw from "../../review/infrastructure/noSql/ReviewRepositoryRaw";
import SendGridRepository from "../integrations/emails/SendGridRepository";
import { DbType, DbQuery } from "../db/database";

type Repos = {
    cartRepository: CartRepository;
    productRepository: ProductRepository;
    reviewRepository: ReviewRepository;
    shippingInfoRepository?: ShippingInfoRepository;
    userRepository: UserRepository;
    emailRepository: EmailRepository;
};

const getRepositories = (env: any): Repos => {
    const useORMQueries = env.DB_QUERIES === DbQuery.ORM.toString();
    if (useORMQueries) {
        return  env.DB_TYPE === DbType.SQL.toString()
            ? {
                cartRepository: new SqlCartRepository(),
                productRepository: new SqlProductRepository(),
                shippingInfoRepository: new SqlShippingInfoRepository(),
                reviewRepository: new SqlReviewRepository(),
                userRepository: new SqlUserRepository(),
                emailRepository: new SendGridRepository(),
            }
            : {
                cartRepository: null,
                productRepository: new NoSqlProductRepository(),
                reviewRepository: new NoSqlReviewRepository(),
                userRepository: new NoSqlUserRepository(),
                emailRepository: new SendGridRepository(),
            };
    }

    return  env.DB_TYPE === DbType.SQL.toString()
        ? {
            cartRepository: new SqlCartRepositoryRaw(),
            productRepository: new SqlProductRepositoryRaw(),
            shippingInfoRepository: new SqlShippingInfoRepositoryRaw(),
            reviewRepository: new SqlReviewRepositoryRaw(),
            userRepository: new SqlUserRepositoryRaw(),
            emailRepository: new SendGridRepository(),
        }
        : {
            cartRepository: null,
            productRepository: new NoSqlProductRepositoryRaw(),
            reviewRepository: new NoSqlReviewRepositoryRaw(),
            userRepository: new NoSqlUserRepositoryRaw(),
            emailRepository: new SendGridRepository(),
        };
}
   

export default getRepositories;
