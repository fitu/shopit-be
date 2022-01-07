import mongoose, { Mongoose } from "mongoose";

import OrderDao from "../../../order/infrastructure/noSql/OrderDao";
import ProductDao from "../../../product/infrastructure/noSql/ProductDao";
import UserDao from "../../../user/infrastructure/noSql/UserDao";
import ReviewDao from "../../../review/infrastructure/noSql/ReviewDao";
import Database, { DatabaseOptions } from "../database";

class NoSqlDb implements Database {
    private env: any;
    private instance: Mongoose;

    constructor(env: any) {
        this.env = env;
    }

    public init = async (options?: DatabaseOptions): Promise<void> => {
        const db = await this.createDbConnection();
        this.instance = db;

        this.initializeSchemas();
    };

    private createDbConnection = async (): Promise<Mongoose> =>
        mongoose.connect(this.env.DB_NO_SQL_HOST, {
            dbName: this.env.DB_NO_SQL_NAME,
            user: this.env.DB_NO_SQL_USER_NAME,
            pass: this.env.DB_NO_SQL_PASSWORD,
        });

    private initializeSchemas = (): void => {
        new OrderDao().init(this.instance);
        new ProductDao().init(this.instance);
        new UserDao().init(this.instance);
        new ReviewDao().init(this.instance);
    };

    public clearDB = async (): Promise<void> => {};
}

export default NoSqlDb;
