import { renameFieldsPlugin } from '#helpers/db.helper.js';
import mongoose, { Schema, SchemaTypes, Types } from 'mongoose';
import Reader from './Reader.js';
import Book from './Book.js';

const BorrowSchema = new Schema({
    maDocGia: {
        type: SchemaTypes.ObjectId,
        ref: Reader,
        required: [true, 'Mã độc giả không được để trống'],
        index: true,
        immutable: true,
    },

    maSach: {
        type: SchemaTypes.ObjectId,
        ref: Book,
        required: [true, 'Mã sách không được để trống'],
        index: true,
        immutable: true,
    },

    ngayMuon: {
        type: Date,
        required: true,
        default: Date.now,
        immutable: true,
    },

    hanTra: {
        type: Date,
        required: [true, 'Hạn trả không được để trống'],
        immutable: true,
        validate: {
            validator: function (v: Date) {
                const borrowDate = (this as any).ngayMuon as Date;
                const maximumDue = new Date(borrowDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                maximumDue.setHours(23, 59, 59, 999); // Default to 30 days from now
                return v >= borrowDate && v <= maximumDue;
            },
            message: 'Hạn trả {VALUE} không hợp lệ! Hạn trả phải trong khoảng từ ngày hiện tại đến 30 ngày sau.'
        },
    },

    ngayTra: {
        type: Date,
        default: null,
    },

    maNhanVien: {
        type: SchemaTypes.ObjectId,
        ref: 'Staff',
        required: [true, 'Mã nhân viên không được để trống'],
        immutable: true,
    },
}, {
    virtuals: {
        status: {
            get() {
                if (this.ngayTra) {
                    return 'returned';
                }
                else if (new Date() > this.hanTra) {
                    return 'overdue';
                }
                else {
                    return 'borrowing';
                }
            }
        }
    },

    statics: {
        async isReaderBorrowing(readerId: Types.ObjectId, bookId: Types.ObjectId) {
            const borrow = await this.exists({ maDocGia: readerId, maSach: bookId, ngayTra: null }).exec();
            return !!borrow;
        }
    },

    collection: 'theoDoiMuonSach'
});

BorrowSchema.index({ maDocGia: 1, maSach: 1, ngayMuon: 1 }, { unique: true });

BorrowSchema.plugin(renameFieldsPlugin({
    maDocGia: 'reader',
    maSach: 'book',
    ngayMuon: 'borrowDate',
    hanTra: 'dueDate',
    ngayTra: 'returnDate',
    maNhanVien: 'staff'
}));

export default mongoose.model('Borrow', BorrowSchema);
