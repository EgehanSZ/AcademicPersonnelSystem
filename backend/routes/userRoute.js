import express from 'express';
import { createUser, deleteUser, getAllUsers, loginUser } from '../controllers/userController.js';
import upload from '../middleware/uploadMiddleware.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
let userRouter = express.Router();



userRouter.post('/user-add', createUser);
userRouter.delete('/user-delete/:id', deleteUser);
userRouter.get('/user-getAll',authenticateToken, getAllUsers)
userRouter.post('/login', loginUser)
userRouter.post('/user-add', upload.single('resim'), createUser);
export default userRouter; 