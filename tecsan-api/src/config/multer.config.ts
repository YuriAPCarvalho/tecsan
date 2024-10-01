import { extname } from 'path';
import * as multerS3 from 'multer-s3';
import { config } from 'dotenv';
import s3Client from './minio.config';

config();

const bucket = process.env.BUCKET;

const multerOptions = {
  storage: multerS3({
    s3: s3Client,
    bucket: bucket,
    acl: 'public-read', 
    key: (req, file, cb) => {
      const name = file.originalname.split(' ').join('-');
      const extension = extname(file.originalname);
      const randomName = Array(32)
        .fill(null)
        .map(() => (Math.round(Math.random() * 16)).toString(16))
        .join('');
        const fileKey = `${name}-${randomName}${extension}`;
      cb(null, fileKey);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'), false);
    }
  },
  limits: {
    files: 1,
    fileSize: (1024 * 1024) * 2, // 2 MB
  },
};

export default multerOptions;
