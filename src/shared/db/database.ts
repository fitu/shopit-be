import NoSqlDb from "./noSql/NoSqlDb";
import SqlDb from "./sql/SqlDb";

enum DbType {
    SQL = 'sql',
    NO_SQL = 'nosql',
}

enum DbQuery {
    ORM = 'orm',
    RAW = 'raw',
}

interface DatabaseOptions {
    force?: boolean;
}

interface Database {
    init: (options?: DatabaseOptions) => Promise<void>;
    clearDB: () => void;
}

const getDb = (env: any): Database => (env.DB_TYPE === DbType.SQL.toString() ? new SqlDb(env) : new NoSqlDb(env));

export type { DatabaseOptions };
export { getDb, DbType, DbQuery };
export default Database;
