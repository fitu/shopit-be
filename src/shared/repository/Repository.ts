import { Repository as CartRepository } from "../../cart/infrastructure/Repository";
import { Repository as ProductRepository } from "../../product/infrastructure/Repository";
import { Repository as ReviewRepository } from "../../review/infrastructure/Repository";
import { Repository as ShippingInfoRepository } from "../../shippingInfo/infrastructure/Repository";
import { Repository as UserRepository } from "../../user/infrastructure/Repository";
import SqlCartRepository from "../../cart/infrastructure/sql/CartRepository";
import SqlProductRepository from "../../product/infrastructure/sql/ProductRepository";
import SqlReviewRepository from "../../review/infrastructure/sql/ReviewRepository";
import SqlShippingInfoRepository from "../../shippingInfo/infrastructure/sql/ShippingInfoRepository";
import SqlUserRepository from "../../user/infrastructure/sql/UserRepository";
import NoSqlCartRepository from "../../cart/infrastructure/noSql/CartRepository";
import NoSqlProductRepository from "../../product/infrastructure/noSql/ProductRepository";
import NoSqlUserRepository from "../../user/infrastructure/noSql/UserRepository";
import NoSqlReviewRepository from "../../review/infrastructure/noSql/ReviewRepository";
import { DbType } from "../db/database";

type Repos = {
    cartRepository: CartRepository;
    productRepository: ProductRepository;
    reviewRepository: ReviewRepository;
    shippingInfoRepository?: ShippingInfoRepository;
    userRepository: UserRepository;
};

const getRepositories = (env: any): Repos =>
    env.DB_TYPE === DbType.SQL.toString()
        ? {
              cartRepository: new SqlCartRepository(),
              productRepository: new SqlProductRepository(),
              shippingInfoRepository: new SqlShippingInfoRepository(),
              reviewRepository: new SqlReviewRepository(),
              userRepository: new SqlUserRepository(),
          }
        : {
              cartRepository: new NoSqlCartRepository(),
              productRepository: new NoSqlProductRepository(),
              reviewRepository: new NoSqlReviewRepository(),
              userRepository: new NoSqlUserRepository(),
          };

export default getRepositories;
