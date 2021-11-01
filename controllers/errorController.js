const { ErrorHandler } = require('../utils/errors');

const handleAppErrors = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    res.status(error.statusCode).json({
        success: false,
        message: error.message || 'Internal server error',
    });
};

module.exports = { handleAppErrors };
