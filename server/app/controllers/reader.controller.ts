import { Request, Response } from 'express';
import { createBaseController } from './base.controller.js';
import readerService from '#services/reader.service.js';
import { Types } from 'mongoose';
import { addAccessToken } from '#helpers/auth.helper.js';
import { GetRequest } from '#helpers/request.helper.js';

// Create base controller functions
const baseController = createBaseController(readerService);

/**
 * Create new reader with auto-login
 */
const create = async (req: Request, res: Response) => {
    const item = await readerService.create(req.body);

    addAccessToken(res, {
        id: item._id.toString(),
        role: 'reader',
    });

    res.status(201).json(item);
};

const getBorrowHistory = async (req: GetRequest, res: Response) => {
    const readerId = req.user!.id;
    const borrows = await readerService.getBorrowHistory(readerId);
    res.status(200).json(borrows);
}

/**
 * Hold a book
 */
const holdBook = async (req: GetRequest<{ bookId: string }>, res: Response) => {
    const reader = req.user!.id;
    const { bookId } = req.params;

    const item = await readerService.holdBook(reader, new Types.ObjectId(bookId));
    res.status(200).json(item);
};

/**
 * Cancel a hold request
 */
const cancelHold = async (req: GetRequest<{ bookId: string }>, res: Response) => {
    const reader = req.user!.id;
    const { bookId } = req.params;

    const item = await readerService.cancelHold(reader, new Types.ObjectId(bookId));
    res.status(200).json(item);
};

/**
 * Get all holds for a reader
 */
const getHolds = async (req: GetRequest, res: Response) => {
    const readerId = req.user!.id;
    const holds = await readerService.getHolds(readerId);
    res.status(200).json(holds);
};

/**
 * Check if a book copy is held by the reader
 */
const checkHold = async (req: GetRequest<{ bookId: string }>, res: Response) => {
    const readerId = req.user!.id;
    const { bookId } = req.params;

    const hold = await readerService.checkHold(readerId, new Types.ObjectId(bookId));

    res.sendStatus(hold ? 204 : 404);
}

// Export all reader controller functions
export default {
    ...baseController,
    create,
    holdBook,
    getBorrowHistory,
    cancelHold,
    getHolds,
    checkHold
};
