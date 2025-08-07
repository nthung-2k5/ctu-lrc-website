import _ from 'lodash';
import { Document, Query, Schema } from 'mongoose';

// export const renameFields = (fields: Record<string, string>) => {
//     return (doc: any) => {
//         return _(doc).mapKeys((_v, key) => ({ _id: 'id', ...fields })[key] || key).value();
//     }
// };

export const renameFields = (fields: Record<string, string>) => {
    return (doc: any) => {
        if (doc && typeof doc === 'object') {
            for (const [oldKey, newKey] of Object.entries({ _id: 'id', ...fields })) {
                if (oldKey in doc && newKey !== oldKey) {
                    doc[newKey] = doc[oldKey];
                    delete doc[oldKey];
                }
            }
        }

        return doc;
    };
};

export const renameFieldsPlugin = (fields: Record<string, string>) => {
    const rename = renameFields(fields);
    const inverseRename = renameFields(_.invert(fields));

    return (schema: Schema) => {
        schema.set('toJSON', {
            transform: (_doc, ret) => rename(ret),
            versionKey: false,
            virtuals: true,
        });

        schema.set('toObject', {
            transform: (_doc, ret) => rename(ret)
        });

        schema.pre('findOneAndUpdate', function (this: Query<any, any>) {
            this.setUpdate(inverseRename(this.getUpdate()));
        });

        schema.static('create', async function (data: any) {
            const doc = new this(inverseRename(data));
            return await doc.save();
        });
    }
};