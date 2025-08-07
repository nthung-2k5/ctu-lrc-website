import { createBaseController } from './base.controller.js';
import bookService, { BookFilter } from '#services/book.service.js';
import { GetRequest } from '#helpers/request.helper.js';
import { Response } from 'express';
import { Types } from 'mongoose';

const baseController = createBaseController(bookService);

const list = async (req: GetRequest<{}, BookFilter>, res: Response) => {
    const items = await bookService.list(req.query, req.user);
    res.status(200).json(items);
};

const find = async (req: GetRequest<{ id: string }>, res: Response) => {
    const item = await bookService.find(new Types.ObjectId(req.params.id), req.user);

    if (!item) {
        res.sendStatus(404);
        return;
    }

    res.status(200).json(item);
};

const search = async (req: GetRequest<{}, { query: string }>, res: Response) => {
    const { query } = req.query;
    const items = await bookService.search(query);
    res.status(200).json(items);
};

const listGenres = async (_req: GetRequest, res: Response) => {
    const genres = await bookService.listGenres();
    res.status(200).json(genres);
};

// Export all book controller functions
export default {
    ...baseController,
    list,
    find,
    search,
    listGenres,
}
