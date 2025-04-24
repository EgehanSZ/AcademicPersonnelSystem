import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadToS3 = async (file) => {
    const fileName = `${uuidv4()}-${file.originalname}`; // Benzersiz dosya adı oluştur
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', // Dosyayı herkese açık yap
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // Yüklenen dosyanın URL'si
    } catch (error) {
        throw new Error('Dosya yüklenirken hata oluştu');
    }
};