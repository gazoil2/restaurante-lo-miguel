import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken } from '../utils/jwtToken';
import { sendJSONResponse } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  context: {
    user: {
      id: string;
      admin: boolean;
    }
  }
}

export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      sendJSONResponse(res, 401, 'No token provided')
      return;
    }

    const decoded = verifyToken(token);
    (req as AuthenticatedRequest).context = {
      user: {
        id: decoded.id.toString(),
        admin: decoded.admin
      }
    };

    next();
  } catch (errouserIdr) {
    sendJSONResponse(res, 401, 'No token provided')
  }
};

export const authenticatedRoute = (handler: (req: AuthenticatedRequest, res: Response) => Promise<void>) => {
  return async (req: Request, res: Response) => {
    await handler(req as AuthenticatedRequest, res);
  };
};