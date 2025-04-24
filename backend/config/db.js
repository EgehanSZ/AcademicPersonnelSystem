import dotenv from 'dotenv'
dotenv.config({ path: './config.env' });
import mongoose from 'mongoose';

const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
    dbName: 'AkademikPersonelSistemi'
};



const connecToServer = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("MongoDB Bağlantısı Gerçekleşti");


    } catch (error) {
        console.error('MongoDB Bağlantı Hatası:', error.message)

    }


};
const getDb = () => {
    return database;
};
export default {
    connecToServer,
    getDb
};