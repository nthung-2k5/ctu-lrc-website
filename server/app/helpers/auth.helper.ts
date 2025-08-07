import { JWT_SECRET, JWT_EXPIRES_IN } from '#config/auth.js';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '#config/auth.js';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { Response } from 'express';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
}

export type JwtUserPayload = {
    id: string;
    role: 'admin' | 'staff' | 'reader';
};

export const addAccessToken = (res: Response, payload: JwtUserPayload) => {
    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRES_IN });

    // Set JWT token in an HTTP-only cookie
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: ms(JWT_EXPIRES_IN),
    });
};
