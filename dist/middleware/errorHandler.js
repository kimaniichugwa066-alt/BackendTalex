"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({
        success: false,
        message,
        details: err.details || null,
    });
};
exports.errorHandler = errorHandler;
