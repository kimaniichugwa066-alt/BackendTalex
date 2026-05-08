import nodemailer from 'nodemailer';
import axios from 'axios';
import { config } from '../config';

const emailTransporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await emailTransporter.sendMail({
      from: config.email.user,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendSMS = async (to: string, message: string) => {
  try {
    // Using Africa's Talking SMS API
    const response = await axios.post(
      'https://api.africastalking.com/version1/messaging',
      new URLSearchParams({
        username: config.sms.username,
        to,
        message,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': config.sms.apiKey,
        },
      }
    );
    console.log(`SMS sent to ${to}`, response.data);
  } catch (error) {
    console.error('SMS send error:', error);
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
    <h1>Welcome to Talex, ${name}!</h1>
    <p>Thank you for joining our platform. Start exploring Canadian job opportunities today.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
  await sendEmail(email, 'Welcome to Talex', html);
};

export const sendVerificationEmail = async (email: string, name: string, token: string) => {
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
  await sendEmail(email, 'Verify Your Email - Talex', html);
};

export const sendApplicationSubmittedEmail = async (email: string, jobTitle: string, trackingNumber: string) => {
  const html = `
    <h1>Application Submitted Successfully</h1>
    <p>Your application for <strong>${jobTitle}</strong> has been submitted.</p>
    <p>Tracking Number: <strong>${trackingNumber}</strong></p>
    <p>You will be notified when there's an update on your application.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
  await sendEmail(email, 'Application Submitted', html);
};

export const sendApplicationStatusUpdateEmail = async (email: string, jobTitle: string, status: string) => {
  const html = `
    <h1>Application Status Update</h1>
    <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
    <p>New Status: <strong>${status}</strong></p>
    <p>Please check your dashboard for more details.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
  await sendEmail(email, `Application ${status}`, html);
};

export const sendPaymentReminderSMS = async (phone: string, jobTitle: string) => {
  const message = `Hi! Complete your payment for ${jobTitle} application on Talex. Ksh 500 required.`;
  await sendSMS(phone, message);
};
