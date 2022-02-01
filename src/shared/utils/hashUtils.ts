import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPasswordSync = (password: string): string => {
    const SALT_ROUNDS = 12;
    return bcrypt.hashSync(password, SALT_ROUNDS);
};

const hashPassword = async (password: string): Promise<string> => {
    const SALT_ROUNDS = 12;
    return bcrypt.hash(password, SALT_ROUNDS);
};

const doPasswordsMatch = async function (password: string, hashedUserPassword): Promise<boolean> {
    return bcrypt.compare(password, hashedUserPassword);
};

const generateRandomToken = async function (): Promise<string> {
    const BYTES_TO_GENERATE = 32;

    return new Promise((resolve, reject) => {
        crypto.randomBytes(BYTES_TO_GENERATE, (error, buffer) => {
            if (error) {
                reject();
            }

            const token = buffer.toString("hex");
            resolve(token);
        });
    });
};

const generateJWTToken = async (email: string): Promise<string> => {
    const JWT_SECRET = process.env.JWT;
    const TOKEN_EXPIRATION_TIME = "1h";
    const token = await jwt.sign({ email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION_TIME });
    const TOKEN_TYPE = "Bearer";
    return `${TOKEN_TYPE} ${token}`;
};

export { hashPasswordSync, hashPassword, doPasswordsMatch, generateRandomToken, generateJWTToken };
