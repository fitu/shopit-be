import SqlDb from "@shared/db/sql/SqlDb";
import NoSqlDb from "@shared/db/noSql/NoSqlDb";
import InMemoryDb from "@shared/db/inMemory/InMemoryDb";

enum DbType {
    SQL = "sql",
    NO_SQL = "no_sql",
    IN_MEMORY = "in_memory",
}

enum DbQuery {
    ORM = "orm",
    RAW = "raw",
}

interface DatabaseOptions {
    readonly force?: boolean;
}

interface Database {
    init: (options?: DatabaseOptions) => Promise<void>;
    clearDB: () => void;
    getInstance: () => any;
}

const getDb = (env: any, dbType: string): Database => {
    const db: Database = {
        [DbType.SQL]: new SqlDb(env),
        [DbType.NO_SQL]: new NoSqlDb(env),
        [DbType.IN_MEMORY]: new InMemoryDb(env),
    }[dbType];

    return db;
};

export type { DatabaseOptions };
export { getDb, DbType, DbQuery };
export default Database;
