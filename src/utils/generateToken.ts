import jwt from "jsonwebtoken";

export const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (error) {
    return null;
  }
};
