import { addAccessToken } from '#helpers/auth.helper.js';
import { PostRequest } from '#helpers/request.helper.js';
import Reader from '#models/Reader.js';
import Staff from '#models/Staff.js';
import { Request, Response } from 'express';
import { Document, Types } from 'mongoose';

const loginRoute = <T extends Document<Types.ObjectId>>(authenticator: (identifier: string, password: string) => Promise<T | null | undefined>, roleSelector: (user: T) => 'admin' | 'staff' | 'reader') => {
    return async (req: PostRequest<{ identifier: string, password: string }>, res: Response) => {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            res.sendStatus(400);
            return;
        }

        const user = await authenticator(identifier, password);
        if (user === undefined) {
            res.sendStatus(404);
            return;
        }
        else if (user === null) {
            res.sendStatus(401);
            return;
        }

        // Generate JWT token
        addAccessToken(res, {
            id: user._id.toString(),
            role: roleSelector(user),
        });

        res.sendStatus(204);
    };
}

// Generic login function for Reader (email-based login)
export const loginReader = loginRoute(Reader.authenticate.bind(Reader), _ => 'reader');

// Login function for Staff (username-based login)
export const loginStaff = loginRoute(Staff.authenticate.bind(Staff), user => user.chucVu);

export const logout = (_req: Request, res: Response) => {
    // Clear the authentication cookie
    res.clearCookie('accessToken');
    res.sendStatus(204);
};