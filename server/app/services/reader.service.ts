import Reader from '#models/Reader.js';
import { Types } from 'mongoose';
import { createBaseService } from './base.service.js';
import HoldRequest from '#models/HoldRequest.js';
import Book from '#models/Book.js';
import Borrow from '#models/Borrow.js';

// Create base service functions
const baseService = createBaseService(Reader);

/**
 * Hold a book for a reader
 */
const holdBook = async (readerId: Types.ObjectId, bookId: Types.ObjectId) => {
    if (!await Reader.exists(readerId)) {
        throw new Error('Reader not found');
    }

    const book = await Book.findById(bookId, { _id: 1, soQuyen: 1 }).exec();
    if (!book) {
        throw new Error('Book not found');
    }

    const { bookHoldings, isHolding } = await HoldRequest.aggregate().facet({
        bookHoldings: [
            { $match: { maSach: book._id } },
            { $count: 'count' }
        ],
        isHolding: [
            { $match: { maSach: book._id, maDocGia: readerId } },
            { $count: 'count' }
        ]
    }).exec();

    if (isHolding) {
        throw new Error('Reader already has a hold request for this book');
    }

    const bookBorrowingsCount = await Borrow.find({ maSach: bookId, ngayTra: null }).countDocuments().exec();

    if (book.soQuyen <= bookBorrowingsCount + bookHoldings) {
        throw new Error('No copies available for hold');
    }

    return await HoldRequest.create({
        maDocGia: readerId,
        maSach: bookId
    });
};

const getBorrowHistory = async (readerId: Types.ObjectId) => {
    return await Borrow.find({ maDocGia: readerId }).populate('maSach').exec();
};

/**
 * Cancel a hold request for a reader
 */
const cancelHold = async (readerId: Types.ObjectId, bookId: Types.ObjectId) => {
    await HoldRequest.findOneAndDelete({ maDocGia: readerId, maSach: bookId }).exec();
};

/**
 * Get all holds for a reader
 */
const getHolds = async (readerId: Types.ObjectId) => {
    return await HoldRequest.find({ maDocGia: readerId }).populate('maSach').exec();
};

/**
 * Check if a reader has a hold on a specific book copy
 */
const checkHold = async (readerId: Types.ObjectId, bookId: Types.ObjectId) => {
    return await HoldRequest.exists({
        maDocGia: readerId,
        maSach: bookId
    }).exec();
};

// Export all reader service functions
export default {
    ...baseService,
    holdBook,
    getBorrowHistory,
    cancelHold,
    getHolds,
    checkHold
};