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
    force?: boolean;
}

interface Database {
    init: (options?: DatabaseOptions) => Promise<void>;
    clearDB: () => void;
    getInstance: () => any
}

const getDb = (env: any): Database => {
    const dbType = env.DB_TYPE;

    if (dbType == DbType.SQL.toString()) {
        return new SqlDb(env);
    }

    if (dbType == DbType.NO_SQL.toString()) {
        return new NoSqlDb(env);
    }

    return new InMemoryDb(env);
};

export type { DatabaseOptions };
export { getDb, DbType, DbQuery };
export default Database;
