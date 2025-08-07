import Publisher from '#models/Publisher.js';
import { createBaseService } from './base.service.js';

const baseService = createBaseService(Publisher);

const list = async (filter = {}, user?: UserPayload) => {
    if (!user || user.isReader) {
        return await Publisher.find(filter, { _id: 1, tenNXB: 1 }).exec();
    }

    return await Publisher.find().populate('titleCount').exec();
};

export default {
    ...baseService,
    list
}
