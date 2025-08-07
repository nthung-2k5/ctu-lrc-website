import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

export default function errorMiddleware(error: any, _req: Request, res: Response, _next: NextFunction) {
    // Log the error for debugging purposes
    console.error(error);

    if (error instanceof mongoose.Error.ValidationError && error.name === 'ValidationError') {
        let errors: Record<string, string> = {};

        Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
        });

        res.status(400).send({
            success: false,
            errors
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: `Internal Server Error: ${error instanceof Error ? error.message : String(error)}`
    });
}