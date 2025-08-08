import { Types } from 'mongoose';
import Staff from '#models/Staff.js';
import Book from '#models/Book.js';
import Borrow from '#models/Borrow.js';
import HoldRequest from '#models/HoldRequest.js';
import Reader from '#models/Reader.js';

const list = async () => {
    return await Borrow.find().populate('maDocGia maSach maNhanVien').exec();
};

const getHoldRequests = async () => {
    return await HoldRequest.find().populate('maDocGia maSach').exec();
};

const acceptHoldRequest = async (staffId: Types.ObjectId, holdId: Types.ObjectId, dueDate?: Date) => {
    const holdRequest = await HoldRequest.findById(holdId).exec();

    if (!holdRequest) {
        throw new Error('Hold request not found');
    }

    return borrowBook(staffId, holdRequest.maDocGia, holdRequest.maSach, dueDate);
};

const borrowBook = async (staffId: Types.ObjectId, readerId: Types.ObjectId, bookId: Types.ObjectId, dueDate?: Date) => {
    if (!await Staff.exists(staffId)) {
        throw new Error('Staff not found');
    }

    if (!await Reader.exists(readerId)) {
        throw new Error('Reader not found');
    }

    // Find the book copy by ID
    const book = await Book.findById(bookId).exec();
    if (!book) {
        throw new Error('Book not found');
    }

    const bookHoldings = await HoldRequest.find({ maSach: bookId }).exec();
    const bookBorrowingsCount = await Borrow.find({ maSach: bookId, ngayTra: null }).countDocuments().exec();

    const isHolding = bookHoldings.some(hold => hold.maDocGia.equals(readerId));

    if (!isHolding && book.soQuyen <= bookBorrowingsCount + bookHoldings.length) {
        throw new Error('No copies available for borrowing');
    }

    // Check if the book copy is available
    const borrow = await Borrow.create({
        maDocGia: readerId,
        maSach: bookId,
        hanTra: dueDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
        maNhanVien: staffId
    });

    if (isHolding) {
        await HoldRequest.deleteOne({ maSach: bookId, maDocGia: readerId });
    }

    return await borrow.populate('maDocGia maSach maNhanVien');
};

/**
 * Process returning a book
 */
const returnBook = async (borrowId: Types.ObjectId) => {
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
        throw new Error('Borrow record not found');
    }

    borrow.ngayTra = new Date();
    await borrow.save();
};

export default {
    list,
    getHoldRequests,
    acceptHoldRequest,
    borrowBook,
    returnBook
};