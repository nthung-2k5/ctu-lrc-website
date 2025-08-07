import express from 'express';
import readerRouter from './reader.routes.js';
import bookRouter from './book.routes.js';
import publisherRouter from './publisher.routes.js';
import staffRouter from './staff.routes.js';
import authRouter from './auth.routes.js';
import borrowRouter from './borrow.routes.js';

export default function registerRoutes(app: express.Express) {
    // Register routes
    app.use('/api/auth', authRouter);
    app.use('/api/readers', readerRouter);
    app.use('/api/books', bookRouter);
    app.use('/api/borrows', borrowRouter);
    app.use('/api/publishers', publisherRouter);
    app.use('/api/staff', staffRouter);
}
