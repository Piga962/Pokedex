import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './auth/auth.router';
import favoritesRouter from './favorites/favorites.router';
import pokemonRouter from './pokemon/pokemon.router';
import { errorHandler } from './middleware/errorHandler';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:8080'];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/pokemon', pokemonRouter);

export default app;
