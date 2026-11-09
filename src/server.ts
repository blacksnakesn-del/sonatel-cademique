import express from 'express';
import { authRouter } from './router/authRouter.js';
 
export const app = express();

app.use(express.json());
app.use('/auth', authRouter);
