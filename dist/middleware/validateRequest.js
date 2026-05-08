"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!result.success) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: result.error.format() });
    }
    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;
    next();
};
exports.validateRequest = validateRequest;
