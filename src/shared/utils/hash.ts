import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
};

const doPasswordsMatch = async function (password: string, hashedUserPassword): Promise<boolean> {
    return bcrypt.compare(password, hashedUserPassword);
};

export { hashPassword, doPasswordsMatch };
