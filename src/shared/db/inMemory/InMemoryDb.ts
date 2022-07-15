import { createClient } from "redis";

import Database, { DatabaseOptions } from "@shared/db/database";

class InMemoryDb implements Database {
    private env: any;
    private instance: any;

    constructor(env: any) {
        this.env = env;
    }

    public init = async (options?: DatabaseOptions): Promise<void> => {
        this.instance = await this.createDbConnection();
    };

    private createDbConnection = async (): Promise<any> => {
        const client = createClient({
            socket: {
                host: this.env.DB_IN_MEMORY_HOST,
                port: this.env.DB_IN_MEMORY_PORT,
            },
            password: this.env.DB_IN_MEMORY_PASSWORD,
        });

        await client.connect();
        return client;
    };

    public getInstance = (): any => this.instance;

    // TODO: complete this
    public clearDB = async (): Promise<void> => {};
}

export default InMemoryDb;
