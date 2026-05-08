"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaymentReminderSMS = exports.sendPasswordResetEmail = exports.sendApplicationStatusUpdateEmail = exports.sendApplicationSubmittedEmail = exports.sendVerificationEmail = exports.sendWelcomeEmail = exports.sendSMS = exports.sendEmail = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const sendEmail = async (to, subject, html) => {
    try {
        const response = await axios_1.default.post('https://api.brevo.com/v3/smtp/email', {
            sender: {
                name: config_1.config.brevo.senderName,
                email: config_1.config.brevo.senderEmail,
            },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        }, {
            headers: {
                'api-key': config_1.config.brevo.apiKey,
                'Content-Type': 'application/json',
            },
        });
        console.log(`Email sent to ${to}`, response.data);
    }
    catch (error) {
        console.error('Email send error:', error);
    }
};
exports.sendEmail = sendEmail;
const sendSMS = async (to, message) => {
    try {
        // Using Africa's Talking SMS API
        const response = await axios_1.default.post('https://api.africastalking.com/version1/messaging', new URLSearchParams({
            username: config_1.config.sms.username,
            to,
            message,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': config_1.config.sms.apiKey,
            },
        });
        console.log(`SMS sent to ${to}`, response.data);
    }
    catch (error) {
        console.error('SMS send error:', error);
    }
};
exports.sendSMS = sendSMS;
const sendWelcomeEmail = async (email, name) => {
    const html = `
    <h1>Welcome to Talex, ${name}!</h1>
    <p>Thank you for joining our platform. Start exploring Canadian job opportunities today.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
    await (0, exports.sendEmail)(email, 'Welcome to Talex', html);
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `https://talex-one.vercel.app/verify?token=${token}`;
    const html = `
    <h1>Welcome to Talex, ${name}!</h1>
    <p>Thank you for registering with Talex. Please verify your email address to activate your account.</p>
    <p><a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p>${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
    await (0, exports.sendEmail)(email, 'Verify Your Email - Talex', html);
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendApplicationSubmittedEmail = async (email, jobTitle, trackingNumber) => {
    const html = `
    <h1>Application Submitted Successfully</h1>
    <p>Your application for <strong>${jobTitle}</strong> has been submitted.</p>
    <p>Tracking Number: <strong>${trackingNumber}</strong></p>
    <p>You will be notified when there's an update on your application.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
    await (0, exports.sendEmail)(email, 'Application Submitted', html);
};
exports.sendApplicationSubmittedEmail = sendApplicationSubmittedEmail;
const sendApplicationStatusUpdateEmail = async (email, jobTitle, status) => {
    const html = `
    <h1>Application Status Update</h1>
    <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
    <p>New Status: <strong>${status}</strong></p>
    <p>Please check your dashboard for more details.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
    await (0, exports.sendEmail)(email, `Application ${status}`, html);
};
exports.sendApplicationStatusUpdateEmail = sendApplicationStatusUpdateEmail;
const sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `https://talex-one.vercel.app/reset-password?token=${token}`;
    const html = `
    <h1>Password Reset Request</h1>
    <p>Hi ${name},</p>
    <p>You requested a password reset for your Talex account. Click the button below to reset your password:</p>
    <p><a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p>${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
    await (0, exports.sendEmail)(email, 'Reset Your Password - Talex', html);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const sendPaymentReminderSMS = async (phone, jobTitle) => {
    const message = `Hi! Complete your payment for ${jobTitle} application on Talex. Ksh 500 required.`;
    await (0, exports.sendSMS)(phone, message);
};
exports.sendPaymentReminderSMS = sendPaymentReminderSMS;
