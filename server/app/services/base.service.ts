import { Model, Types } from 'mongoose';

export interface Service {
    list: (filter?: object) => Promise<any[]>;
    find: (id: Types.ObjectId) => Promise<any | null>;
    create: (data: any) => Promise<any>;
    update: (id: Types.ObjectId, updateData: Partial<any>) => Promise<any | undefined>;
    delete: (id: Types.ObjectId) => Promise<void>;
}

// Base service functions for common CRUD operations
export const createBaseService = <T>(model: Model<T>) => {
    return {
        /**
         * Get a list of all documents from the collection
         */
        list: async (filter: object = {}) => {
            return await model.find(filter).exec();
        },

        /**
         * Find a document by ID
         * @param id Document ID
         */
        find: async (id: Types.ObjectId) => {
            return await model.findById(id).exec();
        },

        /**
         * Create a new document
         * @param data Data to create
         */
        create: async (data: T) => {
            return await model.create(data);
        },

        /**
         * Update a document by ID
         * @param id Document ID
         * @param updateData Data to update
         */
        update: async (id: Types.ObjectId, updateData: Partial<T>) => {
            return await model.findByIdAndUpdate(id, updateData, { new: true }).exec();
        },

        /**
         * Delete a document by ID
         * @param id Document ID
         */
        delete: async (id: Types.ObjectId) => {
            await model.findByIdAndDelete(id).exec();
        },
    };
};