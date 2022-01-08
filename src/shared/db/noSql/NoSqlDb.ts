import mongoose, { Mongoose } from "mongoose";

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
    };

    private createDbConnection = async (): Promise<Mongoose> =>
        mongoose.connect(this.env.DB_NO_SQL_HOST, {
            dbName: this.env.DB_NO_SQL_NAME,
            user: this.env.DB_NO_SQL_USER_NAME,
            pass: this.env.DB_NO_SQL_PASSWORD,
        });

    public clearDB = async (): Promise<void> => {};
}

export default NoSqlDb;
