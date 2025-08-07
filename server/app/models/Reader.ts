import mongoose, { Schema } from 'mongoose';
import { comparePassword, hashPassword } from '#helpers/auth.helper.js';
import { renameFieldsPlugin } from '#helpers/db.helper.js';

const ReaderSchema = new Schema({
    maDocGia: {
        type: String,
        unique: true,
        index: true,
        immutable: true,
        default: () => Date.now().toString().slice(-13),
    },

    hoLot: {
        type: String,
        required: [true, 'Họ không được để trống'],
        trim: true,
    },

    ten: {
        type: String,
        required: [true, 'Tên không được để trống'],
        trim: true,
    },

    ngaySinh: Date,

    phai: {
        type: String,
        enum: ['M', 'F', 'Other'],
        required: [true, 'Giới tính không được để trống'],
    },

    diaChi: {
        type: String,
        trim: true,
    },

    dienThoai: {
        type: String,
        required: [true, 'Số điện thoại không được để trống'],
        validate: {
            validator: (v: string) => /^0\d{9}$/.test(v),
            message: '{VALUE} không phải là số điện thoại hợp lệ!'
        },
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email không được để trống'],
        unique: [true, 'Email đã tồn tại'],
        index: true,
        trim: true
    },
    matKhau: {
        type: String,
        required: [true, 'Mật khẩu không được để trống'],
        select: false,
        trim: true
    },
}, {
    statics: {
        async authenticate(email: string, password: string) {
            const reader = await this.findOne({ email }, { matKhau: 1 }).exec();
            if (!reader) return undefined;
            const isMatch = await comparePassword(password, reader.matKhau);
            return isMatch ? reader : null;
        }
    },

    collection: 'docGia'
});

ReaderSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (this.isModified('matKhau')) {
        this.matKhau = await hashPassword(this.matKhau);
    }
});

ReaderSchema.plugin(renameFieldsPlugin({
    maDocGia: 'code',
    hoLot: 'lastName',
    ten: 'firstName',
    ngaySinh: 'dateOfBirth',
    phai: 'gender',
    diaChi: 'address',
    dienThoai: 'phone',
    matKhau: 'password',
}));

export default mongoose.model('Reader', ReaderSchema);
