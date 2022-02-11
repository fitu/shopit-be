class NotFoundError extends Error {
    constructor(public message: string) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
    }
}

export { NotFoundError };
