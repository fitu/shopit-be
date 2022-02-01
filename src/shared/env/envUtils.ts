import { cleanEnv, str, port } from "envalid";
import dotenv from "dotenv";

import { DbType } from "../db/database";

const validateEnv = (): any => {
    // Load envs
    dotenv.config();

    // Validate and clear envs
    const env = cleanEnv(process.env, {
        DB_TYPE: str({ choices: [DbType.SQL.toString(), DbType.NO_SQL.toString()] }),
        DB_SQL_NAME: str(),
        DB_SQL_USER_NAME: str(),
        DB_SQL_PASSWORD: str(),
        DB_SQL_HOST: str(),
        DB_SQL_PORT: port(),
        DB_NO_SQL_NAME: str(),
        DB_NO_SQL_USER_NAME: str(),
        DB_NO_SQL_PASSWORD: str(),
        DB_NO_SQL_HOST: str(),
        DB_NO_SQL_PORT: port(),
        KEY_EMAILS: str(),
        JWT: str(),
    });

    return env;
};

export default validateEnv;
