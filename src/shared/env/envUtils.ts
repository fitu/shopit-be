import { cleanEnv, str, port } from "envalid";
import dotenv from "dotenv";

const validateEnv = (): any => {
    // Load envs
    dotenv.config();

    // Validate and clear envs
    const env = cleanEnv(process.env, {
        DB_NAME: str(),
        DB_USER_NAME: str(),
        DB_PASSWORD: str(),
        DB_HOST: str(),
        DB_PORT: port(),
    });

    return env;
};

export default validateEnv;
