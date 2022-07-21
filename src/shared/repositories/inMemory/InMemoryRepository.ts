import InMemoryProductRepository from "@product/infrastructure/inMemory/ProductRepository";
import InMemoryUserRepository from "@user/infrastructure/inMemory/UserRepository";
import InMemoryReviewRepository from "@review/infrastructure/inMemory/ReviewRepository";
import InMemoryProductRepositoryRaw from "@product/infrastructure/inMemory/ProductRepositoryRaw";
import InMemoryUserRepositoryRaw from "@user/infrastructure/inMemory/UserRepositoryRaw";
import InMemoryReviewRepositoryRaw from "@review/infrastructure/inMemory/ReviewRepositoryRaw";
import SendGridRepository from "@shared/integrations/emails/SendGridRepository";
import PDFRepository from "@shared/integrations/files/PDFRepository";
import { DbQuery } from "@shared/db/database";
import { Repos, Repository } from "@shared/repositories/Repository";

class InMemoryRepository implements Repository {
    readonly client: any;

    constructor(db: any) {
        this.client = db;
    }

    public getRepos(dbQuery: string): Repos {
        return dbQuery === DbQuery.ORM.toString()
            ? {
                  cartRepository: null,
                  productRepository: new InMemoryProductRepository(),
                  reviewRepository: new InMemoryReviewRepository(),
                  userRepository: new InMemoryUserRepository(this.client),
                  emailRepository: new SendGridRepository(),
                  fileRepository: new PDFRepository(),
              }
            : {
                  cartRepository: null,
                  productRepository: new InMemoryProductRepositoryRaw(),
                  reviewRepository: new InMemoryReviewRepositoryRaw(),
                  userRepository: new InMemoryUserRepositoryRaw(),
                  emailRepository: new SendGridRepository(),
                  fileRepository: new PDFRepository(),
              };
    }
}

export default InMemoryRepository;
