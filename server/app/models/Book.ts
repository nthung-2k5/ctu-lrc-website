import mongoose, { Schema, SchemaTypes } from 'mongoose';
import { renameFieldsPlugin } from '#helpers/db.helper.js';
import { unlinkSync } from 'node:fs';
import Publisher from './Publisher.js';

const BookSchema = new Schema({
    tenSach: {
        type: String,
        required: [true, 'Tên sách không được để trống'],
        trim: true,
        text: true
    },

    ISBN: {
        type: String,
        required: [true, 'ISBN không được để trống'],
        unique: [true, 'ISBN đã tồn tại'],
        trim: true,
        text: true
    },

    donGia: {
        type: Number,
        min: [0, 'Giá sách không thể âm'],
        required: [true, 'Giá sách không được để trống'],
    },

    soQuyen: {
        type: Number,
        min: [1, 'Số quyển sách phải lớn hơn 0'],
        required: [true, 'Số quyển sách không được để trống'],
        default: 1,
    },

    namXuatBan: {
        type: Number,
        required: [true, 'Năm xuất bản không được để trống'],
    },

    maNXB: {
        type: SchemaTypes.ObjectId,
        ref: Publisher,
        required: [true, 'Nhà xuất bản không được để trống']
    },

    tacGia: {
        type: String,
        required: [true, 'Tên tác giả không được để trống'],
        trim: true,
        text: true
    },

    soTrang: {
        type: Number,
        min: [1, 'Số trang sách phải lớn hơn 0'],
        required: [true, 'Số trang sách không được để trống'],
    },

    theLoai: {
        type: [String],
        default: [],
    },

    tomTat: {
        type: String,
        trim: true,
    }
}, {
    collection: 'sach'
});

BookSchema.pre('findOneAndDelete', function () {
    const bookId = this.getQuery()._id;
    unlinkSync(`public/uploads/books/${bookId}.png`);
});

BookSchema.plugin(renameFieldsPlugin({
    tenSach: 'title',
    ISBN: 'ISBN',
    donGia: 'price',
    soQuyen: 'copiesCount',
    namXuatBan: 'publicationYear',
    maNXB: 'publisher',
    tacGia: 'author',
    image: 'image',
    soTrang: 'pageCount',
    theLoai: 'genre',
    tomTat: 'summary'
}));

export default mongoose.model('Book', BookSchema);
