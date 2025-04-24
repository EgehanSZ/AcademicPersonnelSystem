import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js'; // Burada doğru import et
import { deleteUser } from '../controllers/userController.js'; // deleteUser fonksiyonunu import et
import { createListing, deleteListing, getAllListings, getApplicationList } from '../controllers/listingController.js';

const listingRouter = express.Router();

// İlan oluşturma (JWT token doğrulaması ve sadece admin yetkisi olan kullanıcılar için izin verilebilir)
listingRouter.post('/create', authenticateToken, createListing);

// Kullanıcının başvuru listesini getirme
listingRouter.get('/applications/:id', authenticateToken, getApplicationList);

// Tüm ilanları listeleme
// listingRouter.get('/listings', authenticateToken, getAllListings);
listingRouter.get('/listings', getAllListings);


// İlan silme (Sadece ilanı oluşturan kullanıcı silebilir, JWT doğrulama ve yetkilendirme)
listingRouter.delete('/delete/:id', authenticateToken, authorizeRoles('admin'), deleteListing);


export default listingRouter;














// // Güncelleme
// postAdvertisement.route('/ilanlar/:id').put(async (req, res) => {
//     let db = database.getDb();
//     let mongoObject = {
//         $set: {
//             başlık: req.body.başlık,
//             açıklama: req.body.açıklama,
//         }
//     }
//     let data = await db.collection('ilanlar').updateOne({ _id: new ObjectId(req.params.id) }, mongoObject);
//     res.json(data);



// .get(async (req, res) => {
//     let db = database.getDb();
//     let data = await db.collection('ilanlar').find({}).toArray();
//     if (data.length > 0) {
//         res.json(data);
//     } else {
//         throw new Error('No data found');
//     }


// });