import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
    process.env.JWT_SECRET || 'JULIANITSAHUNGRYWORLDTHEYREGONNAEATYOUALIVEYEAHYEAHOHJULIAN';

export interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
