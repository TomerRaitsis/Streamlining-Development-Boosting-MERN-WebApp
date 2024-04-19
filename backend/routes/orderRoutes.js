import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { cacheMiddleware } from '../../redis/cacheMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, cacheMiddleware, getOrders);
router.route('/mine').get(protect, cacheMiddleware, getMyOrders);
router.route('/:id').get(protect, cacheMiddleware, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
