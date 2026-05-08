#!/usr/bin/env node

/**
 * Talex Backend API Test Script
 * Tests all implemented features:
 * 1. User authentication
 * 2. Job posting functionality
 * 3. Application tracking
 * 4. File upload for resumes
 * 5. Email notifications
 * 6. Admin dashboard
 */

const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

class TalexTester {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
    this.tokens = {};
  }

  async testHealth() {
    console.log('\n🔍 Testing API Health...');
    try {
      const response = await this.client.get('/health');
      console.log('✅ Health check passed:', response.data.message);
      return true;
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      return false;
    }
  }

  async testUserRegistration() {
    console.log('\n👤 Testing User Registration...');
    try {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+254712345678',
        password: 'password123'
      };

      const response = await this.client.post('/api/auth/register', userData);
      console.log('✅ User registration successful:', response.data.message);
      this.tokens.user = response.data.data.token;
      return true;
    } catch (error) {
      console.log('❌ User registration failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testUserLogin() {
    console.log('\n🔐 Testing User Login...');
    try {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await this.client.post('/api/auth/login', loginData);
      console.log('✅ User login successful:', response.data.message);
      this.tokens.user = response.data.data.token;
      return true;
    } catch (error) {
      console.log('❌ User login failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testAdminLogin() {
    console.log('\n👑 Testing Admin Login...');
    try {
      // Assuming admin user exists with email: admin@talex.com
      const loginData = {
        email: 'admin@talex.com',
        password: 'admin123'
      };

      const response = await this.client.post('/api/auth/login', loginData);
      console.log('✅ Admin login successful:', response.data.message);
      this.tokens.admin = response.data.data.token;
      return true;
    } catch (error) {
      console.log('❌ Admin login failed (admin user may not exist):', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testJobCreation() {
    console.log('\n💼 Testing Job Creation (Admin)...');
    if (!this.tokens.admin) {
      console.log('⚠️  Skipping job creation - no admin token');
      return false;
    }

    try {
      const jobData = {
        title: 'Software Developer',
        company: 'Tech Corp',
        description: 'We are looking for a skilled software developer...',
        requirements: '3+ years experience, React, Node.js',
        benefits: 'Health insurance, remote work',
        salary: '$50,000 - $70,000',
        province: 'Ontario',
        visaSponsored: true,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      };

      const response = await this.client.post('/api/admin/jobs/create', jobData, {
        headers: { Authorization: `Bearer ${this.tokens.admin}` }
      });

      console.log('✅ Job creation successful:', response.data.message);
      this.createdJobId = response.data.data.job.id;
      return true;
    } catch (error) {
      console.log('❌ Job creation failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testJobListing() {
    console.log('\n📋 Testing Job Listing...');
    try {
      const response = await this.client.get('/api/jobs');
      console.log('✅ Job listing successful, found', response.data.data.jobs.length, 'jobs');
      if (response.data.data.jobs.length > 0) {
        this.testJobId = response.data.data.jobs[0].id;
      }
      return true;
    } catch (error) {
      console.log('❌ Job listing failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testJobDetails() {
    console.log('\n📄 Testing Job Details...');
    if (!this.testJobId) {
      console.log('⚠️  Skipping job details - no job ID');
      return false;
    }

    try {
      const response = await this.client.get(`/api/jobs/${this.testJobId}`);
      console.log('✅ Job details retrieved:', response.data.data.job.title);
      return true;
    } catch (error) {
      console.log('❌ Job details failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testPaymentInitiation() {
    console.log('\n💳 Testing Payment Initiation...');
    if (!this.tokens.user || !this.testJobId) {
      console.log('⚠️  Skipping payment - missing user token or job ID');
      return false;
    }

    try {
      const paymentData = {
        phone: '+254712345678',
        amount: 500,
        jobId: this.testJobId
      };

      const response = await this.client.post('/api/payments/stkpush', paymentData, {
        headers: { Authorization: `Bearer ${this.tokens.user}` }
      });

      console.log('✅ Payment initiation successful:', response.data.message);
      this.paymentId = response.data.data.paymentId;
      return true;
    } catch (error) {
      console.log('❌ Payment initiation failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testApplicationCreation() {
    console.log('\n📝 Testing Application Creation...');
    if (!this.tokens.user || !this.testJobId || !this.paymentId) {
      console.log('⚠️  Skipping application - missing required data');
      return false;
    }

    try {
      const applicationData = {
        jobId: this.testJobId,
        paymentId: this.paymentId
      };

      const response = await this.client.post('/api/applications/create', applicationData, {
        headers: { Authorization: `Bearer ${this.tokens.user}` }
      });

      console.log('✅ Application creation successful:', response.data.message);
      return true;
    } catch (error) {
      console.log('❌ Application creation failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testUserApplications() {
    console.log('\n📂 Testing User Applications...');
    if (!this.tokens.user) {
      console.log('⚠️  Skipping user applications - no user token');
      return false;
    }

    try {
      const response = await this.client.get('/api/applications/user', {
        headers: { Authorization: `Bearer ${this.tokens.user}` }
      });

      console.log('✅ User applications retrieved, found', response.data.data.applications.length, 'applications');
      return true;
    } catch (error) {
      console.log('❌ User applications failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testNotifications() {
    console.log('\n🔔 Testing Notifications...');
    if (!this.tokens.user) {
      console.log('⚠️  Skipping notifications - no user token');
      return false;
    }

    try {
      const response = await this.client.get('/api/notifications', {
        headers: { Authorization: `Bearer ${this.tokens.user}` }
      });

      console.log('✅ Notifications retrieved, found', response.data.data.notifications.length, 'notifications');
      return true;
    } catch (error) {
      console.log('❌ Notifications failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testAdminDashboard() {
    console.log('\n📊 Testing Admin Dashboard...');
    if (!this.tokens.admin) {
      console.log('⚠️  Skipping admin dashboard - no admin token');
      return false;
    }

    try {
      const response = await this.client.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${this.tokens.admin}` }
      });

      console.log('✅ Admin dashboard loaded:', response.data.data);
      return true;
    } catch (error) {
      console.log('❌ Admin dashboard failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async testFileUpload() {
    console.log('\n📎 Testing File Upload...');
    if (!this.tokens.user) {
      console.log('⚠️  Skipping file upload - no user token');
      return false;
    }

    try {
      // Create a simple text file for testing
      const fs = require('fs');
      const path = require('path');
      const testFilePath = path.join(__dirname, 'test-resume.txt');
      fs.writeFileSync(testFilePath, 'This is a test resume file for Talex.');

      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', fs.createReadStream(testFilePath));
      form.append('type', 'CV');

      const response = await this.client.post('/api/upload', form, {
        headers: {
          Authorization: `Bearer ${this.tokens.user}`,
          ...form.getHeaders()
        }
      });

      console.log('✅ File upload successful:', response.data.message);

      // Clean up test file
      fs.unlinkSync(testFilePath);
      return true;
    } catch (error) {
      console.log('❌ File upload failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Talex Backend API Tests...\n');

    const results = {
      health: await this.testHealth(),
      registration: await this.testUserRegistration(),
      login: await this.testUserLogin(),
      adminLogin: await this.testAdminLogin(),
      jobCreation: await this.testJobCreation(),
      jobListing: await this.testJobListing(),
      jobDetails: await this.testJobDetails(),
      payment: await this.testPaymentInitiation(),
      application: await this.testApplicationCreation(),
      userApplications: await this.testUserApplications(),
      notifications: await this.testNotifications(),
      adminDashboard: await this.testAdminDashboard(),
      fileUpload: await this.testFileUpload()
    };

    console.log('\n📋 Test Results Summary:');
    console.log('='.repeat(50));

    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;

    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? '✅' : '❌';
      console.log(`${status} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
    });

    console.log('='.repeat(50));
    console.log(`🎯 Overall: ${passed}/${total} tests passed`);

    if (passed === total) {
      console.log('🎉 All tests passed! Talex backend is fully functional.');
    } else {
      console.log('⚠️  Some tests failed. Check the implementation and configuration.');
    }

    return results;
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new TalexTester();
  tester.runAllTests().catch(console.error);
}

module.exports = TalexTester;
