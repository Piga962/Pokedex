import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './auth/auth.router';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req,res) => {
    res.status(200).json({status: 'ok', timestamp: new Date().toISOString()});
});

app.use('/api/auth', authRouter);

export default app;