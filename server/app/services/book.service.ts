import Book from '#models/Book.js';
import { Types, Error } from 'mongoose';
import { createBaseService } from './base.service.js';
import Borrow from '#models/Borrow.js';
import HoldRequest from '#models/HoldRequest.js';
import sharp from 'sharp';
import _ from 'lodash';
import multer from 'multer';

export type BookFilter = {
    publisher?: string[];
    category?: string[];
    publicationYear?: number[];
};

// Create base service functions
const baseService = createBaseService(Book);

const getBookStatus = async (book, userId?: Types.ObjectId) => {
    const [activeBorrowsCount, holdRequestsCount, userBorrowState] = await Promise.all([
        Borrow.countDocuments({ book: book._id, returnDate: null }).exec(),
        HoldRequest.countDocuments({ book: book._id }).exec(),

        Promise.all(userId ? [
            Borrow.isReaderBorrowing(userId, book._id),
            HoldRequest.isReaderHolding(userId, book._id)
        ] : [])
    ]);

    if (userId) {
        if (userBorrowState[0]) {
            return 'borrowing';
        }
        else if (userBorrowState[1]) {
            return 'holding';
        }
    }

    if (book.copiesCount <= activeBorrowsCount + holdRequestsCount) {
        return 'unavailable';
    }

    return 'available';
};

const list = async (filter: BookFilter = {}, user?: UserPayload) => {
    const filterQuery = _(filter).mapValues(value => {
        return value ? { $in: value } : undefined;
    }).value();

    if (!user || user.role === 'reader') {
        return await Promise.all((await Book.find(filterQuery).exec())
            .map(async book => _(book.toObject()).assign({ 'status': await getBookStatus(book, user?.id) }).value()));
    }

    return await Book.find(filterQuery).populate('maNXB', 'tenNXB').exec();
};

const search = async (query: string) => {
    return await Book.find({ $text: { $search: query } }).exec();
};

const find = async (id: Types.ObjectId, user?: UserPayload) => {
    if (!user || user.role === 'reader') {
        const book = await Book.findById(id, { donGia: 0, soQuyen: 0 })
            .populate({ path: 'maNXB', select: 'tenNXB', transform: doc => doc.tenNXB })
            .exec();

        if (!book) {
            return null;
        }

        return _(book.toObject()).assign({ 'status': await getBookStatus(book, user?.id) }).value();
    }

    return await baseService.find(id);
};

// const create = async (bookData: Omit<Book, 'id'> & { image?: Buffer }) => {
//     const book = await baseService.create(bookData);

//     if (bookData.image) {
//         await sharp(bookData.image).png().toFile(`public/uploads/books/${book.id}.png`);
//     }

//     return book;
// };

/**
 * Update a book with custom logic for copies count validation
 */
const update = async (id: Types.ObjectId, updateData) => {
    if (updateData.copiesCount !== undefined) {
        const currentBorrowCount = await Borrow.countDocuments({ book: id, returnDate: null }).exec();
        const currentHoldCount = await HoldRequest.countDocuments({ book: id }).exec();
        const totalCount = currentBorrowCount + currentHoldCount;

        if (updateData.copiesCount < totalCount) {
            throw new Error('Số quyển sách không thể nhỏ hơn tổng số quyển đang mượn và đang giữ');
        }
    }
    // Use base service update function
    // const book = baseService.update(id, updateData);

    // if (updateData.image) {
    //     await sharp(updateData.image).png().toFile(`public/uploads/books/${id}.png`);
    // }

    return baseService.update(id, updateData);
};

const listGenres = async () => {
    const books = await Book.find({}, { theLoai: 1 }).exec();
    return _(books).flatMap('theLoai').uniq().sort().value();
};

// Export all book service functions
export default {
    ...baseService,
    list,
    find,
    search,
    // create,
    update,
    listGenres,
    getBookStatus,
};