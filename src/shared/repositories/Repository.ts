import { Sequelize } from "sequelize";

import { Repository as CartRepository } from "@cart/infrastructure/Repository";
import { Repository as ProductRepository } from "@product/infrastructure/Repository";
import { Repository as ReviewRepository } from "@review/infrastructure/Repository";
import { Repository as ShippingInfoRepository } from "@shippingInfo/infrastructure/Repository";
import { Repository as UserRepository } from "@user/infrastructure/Repository";
import SqlCartRepository from "@cart/infrastructure/sql/CartRepository";
import SqlProductRepository from "@product/infrastructure/sql/ProductRepository";
import SqlReviewRepository from "@review/infrastructure/sql/ReviewRepository";
import SqlShippingInfoRepository from "@shippingInfo/infrastructure/sql/ShippingInfoRepository";
import SqlUserRepository from "@user/infrastructure/sql/UserRepository";
import SqlCartRepositoryRaw from "@cart/infrastructure/sql/CartRepositoryRaw";
import SqlProductRepositoryRaw from "@product/infrastructure/sql/ProductRepositoryRaw";
import SqlReviewRepositoryRaw from "@review/infrastructure/sql/ReviewRepositoryRaw";
import SqlShippingInfoRepositoryRaw from "@shippingInfo/infrastructure/sql/ShippingInfoRepositoryRaw";
import SqlUserRepositoryRaw from "@user/infrastructure/sql/UserRepositoryRaw";
import NoSqlProductRepository from "@product/infrastructure/noSql/ProductRepository";
import NoSqlUserRepository from "@user/infrastructure/noSql/UserRepository";
import NoSqlReviewRepository from "@review/infrastructure/noSql/ReviewRepository";
import NoSqlProductRepositoryRaw from "@product/infrastructure/noSql/ProductRepositoryRaw";
import NoSqlUserRepositoryRaw from "@user/infrastructure/noSql/UserRepositoryRaw";
import NoSqlReviewRepositoryRaw from "@review/infrastructure/noSql/ReviewRepositoryRaw";
import InMemoryProductRepository from "@product/infrastructure/inMemory/InMemoryProductRepository";
import InMemoryUserRepository from "@user/infrastructure/inMemory/InMemoryUserRepository";
import InMemoryReviewRepository from "@review/infrastructure/inMemory/InMemoryReviewRepository";
import InMemoryProductRepositoryRaw from "@product/infrastructure/inMemory/InMemoryProductRepositoryRaw";
import InMemoryUserRepositoryRaw from "@user/infrastructure/inMemory/InMemoryUserRepositoryRaw";
import InMemoryReviewRepositoryRaw from "@review/infrastructure/inMemory/InMemoryReviewRepositoryRaw";
import { Repository as EmailRepository } from "@shared/integrations/emails/Repository";
import { Repository as FileRepository } from "@shared/integrations/files/Repository";
import SendGridRepository from "@shared/integrations/emails/SendGridRepository";
import PDFRepository from "@shared/integrations/files/PDFRepository";
import { DbType, DbQuery } from "@shared/db/database";

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

    const repos: Repos = useORMQueries ? getORMRepo(env) : getRawRepo(env, db);

    return repos;
};

const getORMRepo = (env: any): Repos => {
    const dbType = env.DB_TYPE;

    if (dbType === DbType.SQL.toString()) {
        return {
            cartRepository: new SqlCartRepository(),
            productRepository: new SqlProductRepository(),
            shippingInfoRepository: new SqlShippingInfoRepository(),
            reviewRepository: new SqlReviewRepository(),
            userRepository: new SqlUserRepository(),
            emailRepository: new SendGridRepository(),
            fileRepository: new PDFRepository(),
        };
    }

    if (dbType === DbType.NO_SQL.toString()) {
        return {
            cartRepository: null,
            productRepository: new NoSqlProductRepository(),
            reviewRepository: new NoSqlReviewRepository(),
            userRepository: new NoSqlUserRepository(),
            emailRepository: new SendGridRepository(),
            fileRepository: new PDFRepository(),
        };
    }

    return {
        cartRepository: null,
        productRepository: new InMemoryProductRepository(),
        reviewRepository: new InMemoryReviewRepository(),
        userRepository: new InMemoryUserRepository(),
        emailRepository: new SendGridRepository(),
        fileRepository: new PDFRepository(),
    };
};

const getRawRepo = (env: any, db: any): Repos => {
    const dbType = env.DB_TYPE;

    if (dbType === DbType.SQL.toString()) {
        const sequelize = db as unknown as Sequelize;

        return {
            cartRepository: new SqlCartRepositoryRaw(sequelize),
            productRepository: new SqlProductRepositoryRaw(sequelize),
            shippingInfoRepository: new SqlShippingInfoRepositoryRaw(sequelize),
            reviewRepository: new SqlReviewRepositoryRaw(sequelize),
            userRepository: new SqlUserRepositoryRaw(sequelize),
            emailRepository: new SendGridRepository(),
            fileRepository: new PDFRepository(),
        };
    }

    if (dbType === DbType.NO_SQL.toString()) {
        return {
            cartRepository: null,
            productRepository: new NoSqlProductRepositoryRaw(),
            reviewRepository: new NoSqlReviewRepositoryRaw(),
            userRepository: new NoSqlUserRepositoryRaw(),
            emailRepository: new SendGridRepository(),
            fileRepository: new PDFRepository(),
        };
    }

    return {
        cartRepository: null,
        productRepository: new InMemoryProductRepositoryRaw(),
        reviewRepository: new InMemoryReviewRepositoryRaw(),
        userRepository: new InMemoryUserRepositoryRaw(),
        emailRepository: new SendGridRepository(),
        fileRepository: new PDFRepository(),
    };
};

export default getRepositories;
