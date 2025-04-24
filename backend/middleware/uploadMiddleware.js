import multer from 'multer';

const storage = multer.memoryStorage(); // Dosyayı bellekte tut
const upload = multer({ storage });

export default upload;