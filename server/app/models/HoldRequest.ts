import { renameFieldsPlugin } from '#helpers/db.helper.js';
import { model, Schema, SchemaTypes, Types } from 'mongoose';
import Book from './Book.js';
import Reader from './Reader.js';

const HoldRequestSchema = new Schema({
    maDocGia: {
        type: SchemaTypes.ObjectId,
        ref: Reader,
        required: [true, 'Mã độc giả không được để trống'],
        index: true,
    },

    maSach: {
        type: SchemaTypes.ObjectId,
        ref: Book,
        required: [true, 'Mã sách không được để trống'],
        index: true,
    },

    ngayGiuSach: {
        type: Date,
        default: Date.now,
        immutable: true,
        required: true,
        expires: '24h',
    },

    ngayHetHan: {
        type: Date,
        immutable: true,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
}, {
    statics: {
        async isReaderHolding(readerId: Types.ObjectId, bookId: Types.ObjectId) {
            const hold = await this.exists({ maDocGia: readerId, maSach: bookId }).exec();
            return !!hold;
        }
    },

    collection: 'theoDoiGiuSach'
});

HoldRequestSchema.index({ maDocGia: 1, maSach: 1 }, { unique: true });
HoldRequestSchema.plugin(renameFieldsPlugin({
    maDocGia: 'reader',
    maSach: 'book',
    ngayGiuSach: 'holdDate',
    ngayHetHan: 'expiryDate'
}));

export default model('HoldRequest', HoldRequestSchema);