import NoSqlDb from "./noSql/NoSqlDb";
import SqlDb from "./sql/SqlDb";

interface DatabaseOptions {
    force?: boolean;
}

interface Database {
    init: (options?: DatabaseOptions) => Promise<void>;
    clearDB: () => void;
}

const getDb = (env: any): Database => (env.DB_TYPE === "sql" ? new SqlDb(env) : new NoSqlDb(env));

export type { DatabaseOptions };
export { getDb };
export default Database;
