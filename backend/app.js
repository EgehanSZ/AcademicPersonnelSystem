import express from 'express';
import cors from 'cors';
import Listing from './routes/listingRoute.js'
import User from './routes/userRoute.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use(Listing);
app.use(User);
export default app;