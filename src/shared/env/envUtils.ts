import { cleanEnv, str, port } from "envalid";
import dotenv from "dotenv";

const validateEnv = (): any => {
    // Load envs
    dotenv.config();

    // Validate and clear envs
    const env = cleanEnv(process.env, {
        DB_TYPE: str(),
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
    });

    return env;
};

export default validateEnv;
