import * as userModel from '../users/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'JULIANITSAHUNGRYWORLDTHEYREGONNAEATYOUALIVEYEAHYEAHOHJULIAN'
const SALT_ROUND = 10;

export const register = async (email: string, password: string) => {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser){
        const error: any = new Error('Email already in use');
        error.statusCode = 409;
        throw error;
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND)
    const newUser = await userModel.create(email,hashedPassword);

    const token = jwt.sign(
        { id: newUser.id, email: newUser.email},
        JWT_SECRET,
        { expiresIn: '1h'}
    );

    return { user: newUser, token};
}

export const login = async (email: string, password: string) => {
    const existingUser = await userModel.findByEmail(email);
    if (!existingUser){
        const error: any = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid){
        const error: any = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }
    const token = jwt.sign(
        { id: existingUser.id, email: existingUser.email},
        JWT_SECRET,
        { expiresIn: '1h'}
    )
    const { password: _, ...user} = existingUser;
    
    return { user, token };
}