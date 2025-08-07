import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import fs from 'node:fs';
import { Readable } from 'node:stream';

export const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'public/uploads/books');
    },

    filename: function (req, file, cb) {
        const id = req.params.id || req.body.id;
        cb(null, id + '.png');
    },

});

class ImageStorage {
    _handleFile(req: any, file: { stream: Readable }, cb: any) {
        const id = req.params.id || req.body.id;
        const filename = `${id}.png`;
        const filepath = path.join('public/uploads/books', filename);

        const png = sharp().png();
        var outStream = fs.createWriteStream(filepath);

        file.stream.pipe(png).pipe(outStream);
        outStream.on('error', cb);
        outStream.on('finish', function () {
            cb(null, {
                path: path,
                size: outStream.bytesWritten
            })
        });
    }

    _removeFile(_req: any, file: any, cb: any) {
        fs.unlink(file.path, cb);
    }
}

export const imageStorage = new ImageStorage();

export const upload = multer({
    storage: imageStorage,
    fileFilter: (_req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed') as any, false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});