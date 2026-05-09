import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { config } from '../config';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail, sendEmail } from '../services/notificationService';

const signToken = (userId: string, role: string) => jwt.sign({ userId, role }, config.jwtSecret, { expiresIn: '7d' });

export const register = async (req: Request, res: Response) => {
  console.log("REGISTER BODY:", { ...req.body, password: "***" }); // Mask password for security
  const { name, email, phone, phoneNumber, password } = req.body;

  // Support both phone and phoneNumber for backward compatibility
  const phoneValue = (phone || phoneNumber || '').trim();

  try {
    const whereConditions: Array<Record<string, unknown>> = [{ email }];
    if (phoneValue) {
      whereConditions.push({ phone: phoneValue });
    }

    const existing = await prisma.user.findFirst({ where: { OR: whereConditions } });
    if (existing) {
      return res.status(409).json(errorResponse('Email or phone already in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, config.jwtSecret, { expiresIn: '24h' });
    const userData: any = {
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: 'USER',
      verificationToken,
    };

    if (phoneValue) {
      userData.phone = phoneValue;
    }

    const user = await prisma.user.create({
      data: userData,
    });

    const token = signToken(user.id, user.role);

    // Send verification email asynchronously
    sendVerificationEmail(user.email, user.name, verificationToken).catch(console.error);

    return res.json(successResponse('Registration successful. Please check your email to verify your account.', { token, role: user.role, user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified } }));
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isVerified && user.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('Please verify your email before logging in'));
    }

    const token = signToken(user.id, user.role);
    return res.json(successResponse('Login successful', { token, role: user.role, user: { id: user.id, name: user.name, email: user.email, role: user.role } }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error',
    });
  }
};

export const refreshToken = async (_req: Request, res: Response) => {
  res.json(successResponse('Refresh token endpoint. Implement token refresh on the client side.'));
};

export const logout = async (_req: Request, res: Response) => {
  res.json(successResponse('Logout successful'));
};

export const testEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(errorResponse('Email is required to send a test email'));
  }

  try {
    const response = await sendEmail({
      to: email,
      subject: 'Talex Brevo Email Test',
      html: '<h1>Talex Brevo Email Test</h1><p>This is a test email sent from BackendTalex.</p>',
      textContent: 'This is a test email sent from BackendTalex.',
    });

    return res.json(successResponse('Test email sent successfully', response));
  } catch (error) {
    return res.status(500).json(errorResponse('Failed to send test email', error));
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    const resetToken = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' });
    await prisma.user.update({
      where: { email },
      data: { resetToken },
    });

    // Send password reset email asynchronously
    sendPasswordResetEmail(user.email, user.name, resetToken).catch(console.error);

    res.json(successResponse('Password reset email sent. Please check your email.'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to send password reset email', error));
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { email: string };
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    if (user.resetToken !== token) {
      return res.status(400).json(errorResponse('Invalid reset token'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword, resetToken: null },
    });

    res.json(successResponse('Password reset successful'));
  } catch (error) {
    res.status(400).json(errorResponse('Invalid or expired reset token'));
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { email: string };
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    if (user.isVerified) {
      return res.status(400).json(errorResponse('Email already verified'));
    }

    if (user.verificationToken !== token) {
      return res.status(400).json(errorResponse('Invalid verification token'));
    }

    await prisma.user.update({
      where: { email: decoded.email },
      data: { isVerified: true, verificationToken: null },
    });

    // Send welcome email after successful verification
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    if (config.urls.frontend) {
      return res.redirect(`${config.urls.frontend}/login?verified=true`);
    }

    return res.json(successResponse('Email verified successfully'));
  } catch (error) {
    res.status(400).json(errorResponse('Invalid or expired verification token'));
  }
};
