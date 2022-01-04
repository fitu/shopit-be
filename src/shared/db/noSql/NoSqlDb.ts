import Database, { DatabaseOptions } from "../database";

class NoSqlDb implements Database {
    private env: any;

    constructor(env: any) {
        this.env = env;
    }

    public init = async (options?: DatabaseOptions): Promise<void> => {
    };

    public clearDB = async (): Promise<void> => {
    };
}

export default NoSqlDb;
