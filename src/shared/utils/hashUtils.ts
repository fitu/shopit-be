import crypto from "crypto";
import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
    const SALT_ROUNDS = 12;
    return bcrypt.hash(password, SALT_ROUNDS);
};

const doPasswordsMatch = async function (password: string, hashedUserPassword): Promise<boolean> {
    return bcrypt.compare(password, hashedUserPassword);
};

const generateToken = async function (): Promise<string> {
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

export { hashPassword, doPasswordsMatch, generateToken };
