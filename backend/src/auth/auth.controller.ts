import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { AuthRequest } from '../middleware/auth';
import * as userModel from '../users/user.model';

export const registerHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const result = await authService.register(email, password);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1 * 60 * 60 * 1000,
        });

        res.status(201).json(result);
    } catch (error: any) {
        next(error);
    }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const result = await authService.login(email, password);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1 * 60 * 60 * 1000,
        });

        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

export const logoutHandler = (req: Request, res: Response) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
    };
    res.clearCookie('token', cookieOptions);
    res.status(200).json({ message: 'Logged out successfully' });
};

export const meHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};
