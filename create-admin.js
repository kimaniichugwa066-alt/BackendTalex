#!/usr/bin/env node

/**
 * Create Admin User Script
 * Creates an admin user for testing admin functionality
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('👑 Creating admin user...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@talex.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@talex.com',
        phone: '+254700000000',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true
      }
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@talex.com');
    console.log('🔑 Password: admin123');
    console.log('📱 Phone: +254700000000');

  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser;
