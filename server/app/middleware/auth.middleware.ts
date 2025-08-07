import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '#config/auth.js';
import { Types } from 'mongoose';
import { JwtUserPayload } from '#helpers/auth.helper.js';

declare global {
    interface UserPayload {
        id: Types.ObjectId;
        role: 'admin' | 'staff' | 'reader';
        isReader: boolean;
        isStaff: boolean;
        isAdmin: boolean;
    }

    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export const jwtParser = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        let token = req.cookies.accessToken as string | undefined;

        if (token) {
            if (!JWT_SECRET) {
                console.error('JWT_SECRET is not defined');
                res.sendStatus(500);
                return;
            }

            try {
                const payload = jwt.verify(token, JWT_SECRET) as JwtUserPayload;

                req.user = Object.freeze({
                    id: new Types.ObjectId(payload.id),
                    role: payload.role,
                    isReader: payload.role === 'reader',
                    isStaff: ['staff', 'admin'].includes(payload.role),
                    isAdmin: payload.role === 'admin',
                });
            } catch (error) {
                res.send(500).json({
                    success: false,
                    errorMessage: `Token verification failed: ${error instanceof Error ? error.message : String(error)}`
                });
            }
        }

        next();
    }
}

export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.sendStatus(401);
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.sendStatus(403);
            return;
        }

        next();
    };
};

export const adminOnly = authorize('admin');
export const staffOnly = authorize('staff', 'admin');
export const readerOnly = authorize('reader');
