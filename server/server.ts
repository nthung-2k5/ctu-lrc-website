import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import registerRoutes from '#routes';
import { jwtParser } from '#middleware/auth.middleware.js';
import connectDB from '#config/db.js';
import errorMiddleware from '#middleware/error.middleware.js';

// Load environment variables
dotenv.config();
connectDB();

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(jwtParser());
app.use(express.static('public'));
app.use(errorMiddleware);

registerRoutes(app);

// Start the server
app.listen(port, () => {
  console.log(`Server đang chạy ở cổng ${port}`);
});
