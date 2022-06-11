class NotAllowError extends Error {
    constructor(public message: string) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
    }
}

export { NotAllowError };
