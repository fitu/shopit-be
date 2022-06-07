import mongoose, { Mongoose } from "mongoose";

import UserDocument from "../../../user/infrastructure/noSql/UserDao";
import ProductDocument from "../../../product/infrastructure/noSql/ProductDao";
import ReviewDocument from "../../../review/infrastructure/noSql/ReviewDao";
import Database, { DatabaseOptions } from "../database";

class NoSqlDb implements Database {
    private env: any;
    private instance: Mongoose;

    constructor(env: any) {
        this.env = env;
    }

    public init = async (options?: DatabaseOptions): Promise<any> => {
        const db = await this.createDbConnection();
        this.instance = db;
        return this.instance;
    };

    private createDbConnection = async (): Promise<Mongoose> =>
        mongoose.connect(`mongodb+srv://${this.env.DB_NO_SQL_HOST}`, {
            dbName: this.env.DB_NO_SQL_NAME,
            user: this.env.DB_NO_SQL_USER_NAME,
            pass: this.env.DB_NO_SQL_PASSWORD,
        });

    // TODO: complete this
    public clearDB = async (): Promise<void> => {
        console.log('Delete users');
        await UserDocument.remove({})

        console.log('Delete products');
        await ProductDocument.remove({})

        console.log('Delete reviews');
        await ReviewDocument.remove({})

        // TODO: delete sessions
    };
}

export default NoSqlDb;
