import { createBaseController } from './base.controller.js';
import publisherService from '#services/publisher.service.js';
import { GetRequest } from '#helpers/request.helper.js';
import { Response } from 'express';

// Export all publisher controller functions
const baseController = createBaseController(publisherService);

const list = async (req: GetRequest, res: Response) => {
    const items = await publisherService.list(req.query, req.user);
    res.status(200).json(items);
};

export default {
    ...baseController,
    list,
    // Additional publisher-specific methods can be added here
};
