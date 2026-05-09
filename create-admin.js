#!/usr/bin/env node

/**
 * Admin User Creation Script
 * Creates an admin user for testing purposes
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('👑 Creating admin user...');

    // Admin user details
    const adminData = {
      name: 'Admin User',
      email: 'admin@talex.com',
      phone: '+1234567890',
      password: 'admin123',
      role: 'ADMIN',
      isVerified: true, // Admin doesn't need email verification
    };

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        password: hashedPassword,
        role: adminData.role,
        isVerified: adminData.isVerified,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Role:', admin.role);
    console.log('✅ Verified:', admin.isVerified);

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser;