import { Sequelize } from "sequelize";

import { Repository as CartRepository } from "../../modules/cart/infrastructure/Repository";
import { Repository as ProductRepository } from "../../modules/product/infrastructure/Repository";
import { Repository as ReviewRepository } from "../../modules/review/infrastructure/Repository";
import { Repository as ShippingInfoRepository } from "../../modules/shippingInfo/infrastructure/Repository";
import { Repository as UserRepository } from "../../modules/user/infrastructure/Repository";
import { Repository as EmailRepository } from "../integrations/emails/Repository";
import { Repository as FileRepository } from "../integrations/files/Repository";
import SqlCartRepository from "../../modules/cart/infrastructure/sql/CartRepository";
import SqlProductRepository from "../../modules/product/infrastructure/sql/ProductRepository";
import SqlReviewRepository from "../../modules/review/infrastructure/sql/ReviewRepository";
import SqlShippingInfoRepository from "../../modules/shippingInfo/infrastructure/sql/ShippingInfoRepository";
import SqlUserRepository from "../../modules/user/infrastructure/sql/UserRepository";
import SqlCartRepositoryRaw from "../../modules/cart/infrastructure/sql/CartRepositoryRaw";
import SqlProductRepositoryRaw from "../../modules/product/infrastructure/sql/ProductRepositoryRaw";
import SqlReviewRepositoryRaw from "../../modules/review/infrastructure/sql/ReviewRepositoryRaw";
import SqlShippingInfoRepositoryRaw from "../../modules/shippingInfo/infrastructure/sql/ShippingInfoRepositoryRaw";
import SqlUserRepositoryRaw from "../../modules/user/infrastructure/sql/UserRepositoryRaw";
import NoSqlProductRepository from "../../modules/product/infrastructure/noSql/ProductRepository";
import NoSqlUserRepository from "../../modules/user/infrastructure/noSql/UserRepository";
import NoSqlReviewRepository from "../../modules/review/infrastructure/noSql/ReviewRepository";
import NoSqlProductRepositoryRaw from "../../modules/product/infrastructure/noSql/ProductRepositoryRaw";
import NoSqlUserRepositoryRaw from "../../modules/user/infrastructure/noSql/UserRepositoryRaw";
import NoSqlReviewRepositoryRaw from "../../modules/review/infrastructure/noSql/ReviewRepositoryRaw";
import SendGridRepository from "../integrations/emails/SendGridRepository";
import PDFRepository from "../integrations/files/PDFRepository";
import { DbType, DbQuery } from "../db/database";

type Repos = {
    cartRepository: CartRepository;
    productRepository: ProductRepository;
    reviewRepository: ReviewRepository;
    shippingInfoRepository?: ShippingInfoRepository;
    userRepository: UserRepository;
    emailRepository: EmailRepository;
    fileRepository: FileRepository;
};

const getRepositories = (env: any, db: any): Repos => {
    const useORMQueries = env.DB_QUERIES === DbQuery.ORM.toString();

    if (useORMQueries) {
        return env.DB_TYPE === DbType.SQL.toString()
            ? {
                  cartRepository: new SqlCartRepository(),
                  productRepository: new SqlProductRepository(),
                  shippingInfoRepository: new SqlShippingInfoRepository(),
                  reviewRepository: new SqlReviewRepository(),
                  userRepository: new SqlUserRepository(),
                  emailRepository: new SendGridRepository(),
                  fileRepository: new PDFRepository(),
              }
            : {
                  cartRepository: null,
                  productRepository: new NoSqlProductRepository(),
                  reviewRepository: new NoSqlReviewRepository(),
                  userRepository: new NoSqlUserRepository(),
                  emailRepository: new SendGridRepository(),
                  fileRepository: new PDFRepository(),
              };
    }

    const sequelize = db as unknown as Sequelize;

    return env.DB_TYPE === DbType.SQL.toString()
        ? {
              cartRepository: new SqlCartRepositoryRaw(sequelize),
              productRepository: new SqlProductRepositoryRaw(sequelize),
              shippingInfoRepository: new SqlShippingInfoRepositoryRaw(sequelize),
              reviewRepository: new SqlReviewRepositoryRaw(sequelize),
              userRepository: new SqlUserRepositoryRaw(sequelize),
              emailRepository: new SendGridRepository(),
              fileRepository: new PDFRepository(),
          }
        : {
              cartRepository: null,
              productRepository: new NoSqlProductRepositoryRaw(),
              reviewRepository: new NoSqlReviewRepositoryRaw(),
              userRepository: new NoSqlUserRepositoryRaw(),
              emailRepository: new SendGridRepository(),
              fileRepository: new PDFRepository(),
          };
};

export default getRepositories;
