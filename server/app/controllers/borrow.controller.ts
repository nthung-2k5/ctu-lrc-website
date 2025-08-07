import { Response } from 'express';
import { Types } from 'mongoose';
import { DeleteRequest, PostRequest } from '#helpers/request.helper.js';
import BorrowService from '#services/borrow.service.js';

const list = async (_req: PostRequest, res: Response) => {
    const items = await BorrowService.list();
    res.status(200).json(items);
};

const getHoldRequests = async (_req: PostRequest, res: Response) => {
    const holdRequests = await BorrowService.getHoldRequests();
    res.status(200).json(holdRequests);
};

const acceptHoldRequest = async (req: PostRequest<{ holdId: string, dueDate?: Date }>, res: Response) => {
    const staffId = req.user!.id;
    const { holdId } = req.body;

    const holdRequest = await BorrowService.acceptHoldRequest(staffId, new Types.ObjectId(holdId));
    res.status(200).json(holdRequest);
};

const borrowBook = async (req: PostRequest<{ readerId: string, bookId: string, dueDate?: Date }>, res: Response) => {
    const staffId = req.user!.id;
    const { readerId, bookId, dueDate } = req.body;

    await BorrowService.borrowBook(
        staffId,
        new Types.ObjectId(readerId),
        new Types.ObjectId(bookId),
        dueDate
    );

    res.sendStatus(201);
};

/**
 * Process returning a book
 */
const returnBook = async (req: DeleteRequest<{}, { borrowId: string }>, res: Response) => {
    const { borrowId } = req.query;

    const borrow = await BorrowService.returnBook(new Types.ObjectId(borrowId));

    res.status(200).json(borrow);
};

export default {
    list,
    getHoldRequests,
    acceptHoldRequest,
    borrowBook,
    returnBook
};