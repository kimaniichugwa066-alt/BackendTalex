#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests the Neon PostgreSQL database connection
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Database query successful. Found ${userCount} users`);

    // Test if tables exist by trying to count records
    const tables = ['User', 'Job', 'Application', 'Payment', 'Document', 'Notification'];

    console.log('\n📊 Table status:');
    for (const table of tables) {
      try {
        const count = await prisma[table.toLowerCase()].count();
        console.log(`✅ ${table}: ${count} records`);
      } catch (error) {
        console.log(`❌ ${table}: Table not found or error - ${error.message}`);
      }
    }

    console.log('\n🎉 Database is ready for use!');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your MONGO_URI in .env file');
    console.log('2. Ensure your MongoDB cluster is accessible');
    console.log('3. Verify your MongoDB credentials are correct');
    console.log('4. Check network connectivity');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  testDatabaseConnection();
}

module.exports = testDatabaseConnection;
