import axios from 'axios';
import { config } from '../config';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  textContent?: string;
}

export const sendEmail = async ({ to, subject, html, textContent }: EmailParams) => {
  if (!config.brevo.apiKey) {
    throw new Error('Brevo API key is not configured. Set BREVO_API_KEY in your environment variables.');
  }

  if (!config.brevo.senderEmail) {
    throw new Error('Brevo sender email is not configured. Set BREVO_SENDER_EMAIL or SENDER_EMAIL in your environment variables.');
  }

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: config.brevo.senderName,
          email: config.brevo.senderEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: textContent || html.replace(/<[^>]+>/g, ''),
      },
      {
        headers: {
          'api-key': config.brevo.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`Email sent to ${to}`, response.data);
    return response.data;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
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
  await sendEmail({ to: email, subject: 'Welcome to Talex', html });
};

export const sendVerificationEmail = async (email: string, name: string, token: string) => {
  const verificationUrl = `${config.urls.backend}/api/auth/verify/${token}`;
  const html = `
    <h1>Welcome to Talex, ${name}!</h1>
    <p>Thank you for registering with Talex. Please verify your email address to activate your account.</p>
    <p><a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p>${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
  await sendEmail({ to: email, subject: 'Verify Your Email - Talex', html });
};

export const sendApplicationSubmittedEmail = async (email: string, jobTitle: string, trackingNumber: string) => {
  const html = `
    <h1>Application Submitted Successfully</h1>
    <p>Your application for <strong>${jobTitle}</strong> has been submitted.</p>
    <p>Tracking Number: <strong>${trackingNumber}</strong></p>
    <p>You will be notified when there's an update on your application.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
  await sendEmail({ to: email, subject: 'Application Submitted', html });
};

export const sendApplicationStatusUpdateEmail = async (email: string, jobTitle: string, status: string) => {
  const html = `
    <h1>Application Status Update</h1>
    <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
    <p>New Status: <strong>${status.replace(/_/g, ' ')}</strong></p>
    <p>Please check your dashboard for more details.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
  await sendEmail({ to: email, subject: `Application ${status.replace(/_/g, ' ')}`, html });
};

export const sendInterviewScheduledEmail = async (email: string, jobTitle: string, date: string, link: string) => {
  const html = `
    <h1>Interview Scheduled</h1>
    <p>Your interview for <strong>${jobTitle}</strong> has been scheduled.</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Link:</strong> <a href="${link}">${link}</a></p>
    <p>Best regards,<br>The Talex Team</p>
  `;
  await sendEmail({ to: email, subject: 'Interview Scheduled - Talex', html });
};

export const sendOfferEmail = async (email: string, jobTitle: string) => {
  const html = `
    <h1>Offer Sent</h1>
    <p>Congratulations! An offer has been sent for <strong>${jobTitle}</strong>.</p>
    <p>Please review the offer details and respond as soon as possible.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
  await sendEmail({ to: email, subject: 'Offer Letter - Talex', html });
};

export const sendHiredEmail = async (email: string, jobTitle: string) => {
  const html = `
    <h1>Welcome to the Team!</h1>
    <p>Congratulations! You have been hired for <strong>${jobTitle}</strong>.</p>
    <p>We are excited to have you onboard.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
  await sendEmail({ to: email, subject: 'You Have Been Hired - Talex', html });
};

export const sendRejectedEmail = async (email: string, jobTitle: string) => {
  const html = `
    <h1>Application Update</h1>
    <p>Thank you for applying for <strong>${jobTitle}</strong>.</p>
    <p>After careful review, we regret to inform you that this role will not be moving forward.</p>
    <p>We appreciate your interest and encourage you to apply for other opportunities.</p>
    <p>Best regards,<br>The Talex Team</p>
  `;
  await sendEmail({ to: email, subject: 'Application Update - Talex', html });
};

export const sendPasswordResetEmail = async (email: string, name: string, token: string) => {
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
  await sendEmail({ to: email, subject: 'Reset Your Password - Talex', html });
};

export const sendPaymentReminderSMS = async (phone: string, jobTitle: string) => {
  const message = `Hi! Complete your payment for ${jobTitle} application on Talex. Ksh 500 required.`;
  await sendSMS(phone, message);
};
