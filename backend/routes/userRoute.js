import express from 'express';
import { createUser, deleteUser, getAllUsers, loginUser, uploadProfilePhoto, changePassword, getCurrentUser, updateUser, getJuriUsers } from '../controllers/userController.js';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

let userRouter = express.Router();



userRouter.post('/user-add', createUser);
userRouter.post('/user-upload/photo', upload.single('resimUrl'), uploadProfilePhoto);
userRouter.post('/user-update/photo', authenticateToken, upload.single('resimUrl'), uploadProfilePhoto);
userRouter.delete('/user-delete/:id', deleteUser);
userRouter.get('/user-getAll', authenticateToken, getAllUsers)
userRouter.post('/login', loginUser)
userRouter.post('/change-password', authenticateToken, changePassword)
userRouter.get('/user-me', authenticateToken, getCurrentUser);
userRouter.put('/user-update', authenticateToken, updateUser);
userRouter.get('/user-getJuri', authenticateToken, authorizeRoles('admin'), getJuriUsers);

export default userRouter;

