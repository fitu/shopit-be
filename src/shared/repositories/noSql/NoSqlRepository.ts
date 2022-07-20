import NoSqlProductRepository from "@product/infrastructure/noSql/ProductRepository";
import NoSqlUserRepository from "@user/infrastructure/noSql/UserRepository";
import NoSqlReviewRepository from "@review/infrastructure/noSql/ReviewRepository";
import NoSqlProductRepositoryRaw from "@product/infrastructure/noSql/ProductRepositoryRaw";
import NoSqlUserRepositoryRaw from "@user/infrastructure/noSql/UserRepositoryRaw";
import NoSqlReviewRepositoryRaw from "@review/infrastructure/noSql/ReviewRepositoryRaw";
import SendGridRepository from "@shared/integrations/emails/SendGridRepository";
import PDFRepository from "@shared/integrations/files/PDFRepository";
import { DbQuery } from "@shared/db/database";
import { Repos, Repository } from "@shared/repositories/Repository";

class NoSqlRepository implements Repository {
    constructor() {}

    public getRepos(dbQuery: string): Repos {
        return dbQuery === DbQuery.ORM.toString()
            ? {
                  cartRepository: null,
                  productRepository: new NoSqlProductRepository(),
                  reviewRepository: new NoSqlReviewRepository(),
                  userRepository: new NoSqlUserRepository(),
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
    }
}

export default NoSqlRepository;
