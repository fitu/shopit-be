import { Sequelize } from "sequelize/dist";

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
import SendGridRepository from "@shared/integrations/emails/SendGridRepository";
import PDFRepository from "@shared/integrations/files/PDFRepository";
import { DbQuery } from "@shared/db/database";
import { Repos, Repository } from "@shared/repositories/Repository";

class SqlRepository implements Repository {
    readonly db: Sequelize;

    constructor({ db }: { db?: any }) {
        this.db = db;
    }

    public getRepos(dbQuery: string): Repos {
        return dbQuery === DbQuery.ORM.toString()
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
                  cartRepository: new SqlCartRepositoryRaw(this.db),
                  productRepository: new SqlProductRepositoryRaw(this.db),
                  shippingInfoRepository: new SqlShippingInfoRepositoryRaw(this.db),
                  reviewRepository: new SqlReviewRepositoryRaw(this.db),
                  userRepository: new SqlUserRepositoryRaw(this.db),
                  emailRepository: new SendGridRepository(),
                  fileRepository: new PDFRepository(),
              };
    }
}

export default SqlRepository;
