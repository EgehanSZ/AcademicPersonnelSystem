import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js'; // Burada doğru import et
import { createListing, deleteListing, getAllListings, getListing, getApplicationList, listingApply, getApplications, updateListing, addJuriInListing, getApplicationsByJuri } from '../controllers/listingController.js';

const listingRouter = express.Router();

listingRouter.post('/listings/create', authenticateToken, authorizeRoles('admin'), createListing);
listingRouter.get('/applications/juri', authenticateToken, authorizeRoles('juri'), getApplicationsByJuri);
listingRouter.get('/applications/:id', authenticateToken, getApplicationList);
listingRouter.get('/listings', getAllListings);
listingRouter.get('/listings/:id', getListing);
listingRouter.delete('/listings/delete/:id', authenticateToken, authorizeRoles('admin'), deleteListing);
listingRouter.post('/listings/:id/apply', authenticateToken, authorizeRoles('aday'), upload.single('dosya'), listingApply);
listingRouter.get('/applications', authenticateToken, authorizeRoles('admin'), getApplications);
listingRouter.put('/listings/:id', authenticateToken, authorizeRoles('admin'), updateListing);
listingRouter.put('/listings/:id/juri', authenticateToken, authorizeRoles('admin'), addJuriInListing);


export default listingRouter;



