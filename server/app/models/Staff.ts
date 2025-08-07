import { comparePassword, hashPassword } from '#helpers/auth.helper.js';
import { renameFieldsPlugin } from '#helpers/db.helper.js';
import mongoose, { Schema } from 'mongoose';

const StaffSchema = new Schema({
    hoTenNV: {
        type: String,
        required: [true, 'Họ tên nhân viên không được để trống'],
        trim: true,
    },

    tenDangNhap: {
        type: String,
        required: [true, 'Tên đăng nhập không được để trống'],
        unique: [true, 'Tên đăng nhập đã tồn tại'],
        index: true,
        trim: true,
    },

    matKhau: {
        type: String,
        required: true,
        select: false,
        trim: true,
    },

    chucVu: {
        type: String,
        enum: ['admin', 'staff'],
        default: 'staff',
    },

    diaChi: {
        type: String,
        trim: true,
    },

    soDienThoai: {
        type: String,
        trim: true,
        validate: {
            validator: (v: string) => /^0\d{9}$/.test(v),
            message: props => `${props.value} không phải là số điện thoại hợp lệ!`
        },
    },
}, {
    statics: {
        async authenticate(username: string, password: string) {
            const staff = await this.findOne({ tenDangNhap: username }, { matKhau: 1, chucVu: 1 }).exec();
            if (!staff) return undefined;
            const isMatch = await comparePassword(password, staff.matKhau);
            return isMatch ? staff : null;
        }
    },

    collection: 'nhanVien',
});

StaffSchema.pre('save', async function (next) {
    if (this.isModified('matKhau')) {
        this.matKhau = await hashPassword(this.matKhau);
    }

    next();
});

StaffSchema.plugin(renameFieldsPlugin({
    tenDangNhap: 'username',
    hoTenNV: 'name',
    chucVu: 'role',
    diaChi: 'address',
    soDienThoai: 'phone',
    matKhau: 'password',
}));

// Define the schema
export default mongoose.model('Staff', StaffSchema);
