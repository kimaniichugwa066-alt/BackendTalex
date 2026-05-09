"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = __importDefault(require("../prisma/client"));
const createDefaultAdmin = async () => {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@talex.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123@';
    const adminName = process.env.DEFAULT_ADMIN_NAME || 'Talex Admin';
    const existingAdmin = await client_1.default.user.findUnique({
        where: { email: adminEmail },
    });
    if (existingAdmin) {
        console.log(`✅ Default admin already exists: ${adminEmail}`);
        return existingAdmin;
    }
    const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
    const admin = await client_1.default.user.create({
        data: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
            isVerified: true,
        },
    });
    console.log('✅ Default admin created successfully');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    return admin;
};
exports.createDefaultAdmin = createDefaultAdmin;
