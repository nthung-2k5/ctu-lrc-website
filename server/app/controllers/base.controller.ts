import { DeleteRequest, GetRequest, PostRequest, PutRequest } from '#helpers/request.helper.js';
import { Service } from '#services/base.service.js';
import { Types } from 'mongoose';
import { Response } from 'express';

// Base controller functions for common CRUD operations
export const createBaseController = (service: Service) => {
    return {
        /**
         * List all entities
         */
        list: async (req: GetRequest, res: Response) => {
            const items = await service.list(req.query);
            res.status(200).json(items);
        },

        /**
         * Find entity by ID
         */
        find: async (req: GetRequest<{ id: string }>, res: Response) => {
            const { id } = req.params;
            const item = await service.find(new Types.ObjectId(id));

            if (!item) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(item);
        },

        /**
         * Create new entity
         */
        create: async (req: PostRequest, res: Response) => {
            const item = await service.create(req.body);
            res.status(201).json(item);
        },

        /**
         * Update entity by ID
         */
        update: async (req: PutRequest<{ id: string }>, res: Response) => {
            const { id } = req.params;
            const updatedItem = await service.update(new Types.ObjectId(id), req.body);

            if (!updatedItem) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(updatedItem);
        },

        /**
         * Delete entity by ID
         */
        delete: async (req: DeleteRequest<{ id: string }>, res: Response) => {
            const { id } = req.params;
            await service.delete(new Types.ObjectId(id));

            res.sendStatus(204);
        }
    }
};
