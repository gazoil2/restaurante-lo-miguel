import jwt from 'jsonwebtoken';

const JWT_SECRET = 'gazo'

const EXPIRES_IN = '7w';

export const generateToken = (userId: number) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { id: number };
};