import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken } from '../utils/jwtToken';
import { isRequestUserAdmin } from '../utils/checkAdmin';

export interface AuthenticatedRequest extends Request {
    context: {
        user: {
            userId: string;
            admin: boolean;
        }
    }
}

export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }
      
      const decoded = verifyToken(token);
      (req as AuthenticatedRequest).context = {
        user: {
          userId: decoded.id.toString(),
          admin: decoded.admin
        }
      };
      
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

export const authenticatedRoute = (handler: (req: AuthenticatedRequest, res: Response) => Promise<void>) => {
    return async (req: Request, res: Response) => {
      await handler(req as AuthenticatedRequest, res);
    };
  };