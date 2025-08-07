import { renameFieldsPlugin } from '#helpers/db.helper.js';
import mongoose, { Schema } from 'mongoose';

const PublisherSchema = new Schema({
    tenNXB: {
        type: String,
        required: [true, 'Tên nhà xuất bản không được để trống'],
        trim: true,
    },

    diaChi: {
        type: String,
        required: [true, 'Địa chỉ nhà xuất bản không được để trống'],
        trim: true,
    },

    sdt: {
        type: String,
        validate: {
            validator: (v: string) => /^\d{10,11}$/.test(v), // Basic validation for phone numbers
            message: props => `${props.value} is not a valid phone number!`
        },
        trim: true,
    },

    email: {
        type: String,
        trim: true
    },

    website: {
        type: String,
        trim: true
    }
}, {
    collection: 'nhaXuatBan',
    virtuals: {
        titleCount: {
            options: {
                ref: 'Book',
                localField: '_id',
                foreignField: 'maNXB',
                count: true,
            }
        }
    }
});

PublisherSchema.plugin(renameFieldsPlugin({
    tenNXB: 'name',
    diaChi: 'address',
    sdt: 'phone'
}));

export default mongoose.model('Publisher', PublisherSchema);