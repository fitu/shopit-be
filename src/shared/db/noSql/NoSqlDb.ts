import mongoose, { Mongoose } from "mongoose";

import orderSchema from "../../../order/infrastructure/noSql/OrderDao";
import productSchema from "../../../product/infrastructure/noSql/ProductDao";
import userSchema from "../../../user/infrastructure/noSql/UserDao";
import reviewSchema from "../../../review/infrastructure/noSql/ReviewDao";
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
        mongoose.model("User", userSchema);
        mongoose.model("Order", orderSchema);
        mongoose.model("Product", productSchema);
        mongoose.model("Review", reviewSchema);
    };

    public clearDB = async (): Promise<void> => {};
}

export default NoSqlDb;
