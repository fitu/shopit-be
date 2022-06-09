class SignInError extends Error {
    constructor(public message: string) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
    }
}

export { SignInError };
