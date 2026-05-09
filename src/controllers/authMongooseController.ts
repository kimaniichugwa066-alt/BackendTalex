import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import { successResponse, errorResponse } from '../utils/apiResponse';

// ✅ REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json(errorResponse('Please provide all required fields'));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json(errorResponse('Email or phone already in use'));
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: role || 'user',
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json(
      successResponse('User created successfully', {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      })
    );
  } catch (err: any) {
    res.status(500).json(errorResponse('Register failed', err.message));
  }
};

// ✅ LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json(errorResponse('Please provide email and password'));
    }

    // Find user
    const user = await User.findOne({ email }) as any;
    if (!user) {
      return res.status(401).json(errorResponse('User not found'));
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json(errorResponse('Invalid password'));
    }

    // Generate token
    const token = generateToken(user);

    res.json(
      successResponse('Login successful', {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      })
    );
  } catch (err: any) {
    res.status(500).json(errorResponse('Login failed', err.message));
  }
};

// ✅ GET CURRENT USER
export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }
    res.json(successResponse('User loaded', { user }));
  } catch (err: any) {
    res.status(500).json(errorResponse('Failed to load user', err.message));
  }
};
