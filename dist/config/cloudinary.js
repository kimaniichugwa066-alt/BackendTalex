"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    CLOUDINARY_URL: process.env.CLOUDINARY_URL
});
exports.default = cloudinary_1.v2;
