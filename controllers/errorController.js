const { ErrorHandler } = require('../utils/errors');

const handleAppErrors = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    // TODO: use another file for production, not env vars
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message || 'Internal server error',
    });
};

module.exports = { handleAppErrors };
