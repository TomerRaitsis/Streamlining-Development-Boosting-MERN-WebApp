import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { cacheMiddleware } from '../../redis/cacheMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, cacheMiddleware, getUsers);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, cacheMiddleware, getUserProfile)
  .put(protect, cacheMiddleware, updateUserProfile);
router
  .route('/:id')
  .delete(protect, admin, cacheMiddleware, deleteUser)
  .get(protect, admin, cacheMiddleware, getUserById)
  .put(protect, admin, cacheMiddleware, updateUser);

export default router;
