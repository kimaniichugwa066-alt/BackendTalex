"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaymentReminderSMS = exports.sendApplicationStatusUpdateEmail = exports.sendApplicationSubmittedEmail = exports.sendWelcomeEmail = exports.sendSMS = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const emailTransporter = nodemailer_1.default.createTransport({
    host: config_1.config.email.host,
    port: config_1.config.email.port,
    secure: config_1.config.email.port === 465,
    auth: {
        user: config_1.config.email.user,
        pass: config_1.config.email.pass,
    },
});
const sendEmail = async (to, subject, html) => {
    try {
        await emailTransporter.sendMail({
            from: config_1.config.email.user,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}`);
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
const sendPaymentReminderSMS = async (phone, jobTitle) => {
    const message = `Hi! Complete your payment for ${jobTitle} application on Talex. Ksh 500 required.`;
    await (0, exports.sendSMS)(phone, message);
};
exports.sendPaymentReminderSMS = sendPaymentReminderSMS;
