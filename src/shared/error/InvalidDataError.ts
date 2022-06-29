class InvalidDataError extends Error {
    constructor(public message: string) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default InvalidDataError;
