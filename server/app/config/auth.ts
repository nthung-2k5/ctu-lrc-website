import ms from 'ms';

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as ms.StringValue || '1d';

export const SALT_ROUNDS = 10; // For bcrypt password hashing
