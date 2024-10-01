const Minio = require('minio');

const minioClient = new Minio.Client({
  region: 'us-east-1',
  endPoint: '77.37.40.207',
  port: 7000,
  useSSL: false,
  accessKey: 'D9Tkz07MHkJzGyCiJUyn',
  secretKey: 'wivGPw5mLV35hO5wYsVqlbRQnLw2WUgyJosjUbeh',
});

async function generatePresignedUrl(bucketName, objectName, expiryTime) {
  try {

    const reqParams = {
      'response-content-type': 'image/png' 
    };
    const url = await minioClient.presignedGetObject(bucketName, objectName, expiryTime, reqParams);

    console.log('Presigned URL:', url);
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
  }
}


generatePresignedUrl('stok-hml', 'alicate.png-0d24e97938d545779435de1b0b0d8eeb.png', 24 * 60 * 60); 
