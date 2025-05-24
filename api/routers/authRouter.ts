import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtToken';

interface AuthenticatedRequest extends Request {
    userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    (req as AuthenticatedRequest).userId = (decoded.id).toString() ;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};