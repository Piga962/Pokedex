import { Request, Response, NextFunction, Router } from 'express';
import * as authService from './auth.service';

export const registerHandler = async (req: Request, res: Response, next:NextFunction) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required'})
        }
        const result = await authService.register(email, password);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1*60*60*1000
        });

        res.status(201).json(result);
    } catch(error:any){
        next(error)
    }
}

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: 'Email and password are required'})
        }

        const result = await authService.login(email, password);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1*60*60*1000
        });

        res.status(200).json(result);
    } catch(error:any){
        next(error)
    }
}