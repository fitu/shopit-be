import mongoose, { Mongoose } from "mongoose";

import UserDocument from "@user/infrastructure/noSql/UserDao";
import ProductDocument from "@product/infrastructure/noSql/ProductDao";
import ReviewDocument from "@review/infrastructure/noSql/ReviewDao";
import Database, { DatabaseOptions } from "@shared/db/database";

class NoSqlDb implements Database {
    private instance: Mongoose;

    constructor(private readonly env: any) {}

    public init = async (options?: DatabaseOptions): Promise<void> => {
        this.instance = await this.createDbConnection();
    };

    private createDbConnection = async (): Promise<Mongoose> =>
        mongoose.connect(this.env.DB_NO_SQL_HOST, {
            dbName: this.env.DB_NO_SQL_NAME,
            user: this.env.DB_NO_SQL_USER_NAME,
            pass: this.env.DB_NO_SQL_PASSWORD,
        });

    public getInstance = (): any => this.instance;

    // TODO: complete this
    public clearDB = async (): Promise<void> => {
        console.log("Delete users");
        await UserDocument.remove({});

        console.log("Delete products");
        await ProductDocument.remove({});

        console.log("Delete reviews");
        await ReviewDocument.remove({});
    };
}

export default NoSqlDb;
