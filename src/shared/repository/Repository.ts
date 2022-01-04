import { Repository as CartRepository } from "../../cart/infrastructure/Repository";
import { Repository as ProductRepository } from "../../product/infrastructure/Repository";
import { Repository as UserRepository } from "../../user/infrastructure/Repository";

import SqlCartRepository from "../../cart/infrastructure/sql/CartRepository";
import SqlProductRepository from "../../product/infrastructure/sql/ProductRepository";
import SqlUserRepository from "../../user/infrastructure/sql/UserRepository";

import NoSqlCartRepository from "../../cart/infrastructure/noSql/CartRepository";
import NoSqlProductRepository from "../../product/infrastructure/noSql/ProductRepository";
import NoSqlUserRepository from "../../user/infrastructure/noSql/UserRepository";

type Repos = {
    cartRepository: CartRepository;
    productRepository: ProductRepository;
    userRepository: UserRepository;
};

const getRepositories = (env: any): Repos =>
    env.DB_TYPE === "sql"
        ? {
              cartRepository: new SqlCartRepository(),
              productRepository: new SqlProductRepository(),
              userRepository: new SqlUserRepository(),
          }
        : {
              cartRepository: new NoSqlCartRepository(),
              productRepository: new NoSqlProductRepository(),
              userRepository: new NoSqlUserRepository(),
          };

export default getRepositories;
