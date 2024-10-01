import { S3Client } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
config();

const s3Client = new S3Client({
  region: 'us-east-1', 
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true, 
});

export default s3Client;
