import connect from './config/db.js';
import dotenv from 'dotenv'
dotenv.config({ path: './config.env' });
import app from './app.js';

const startServer = async () => {
    try {
        await connect.connecToServer();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Sunucu başlatılamadı:", error.message);
    }

};
startServer();

