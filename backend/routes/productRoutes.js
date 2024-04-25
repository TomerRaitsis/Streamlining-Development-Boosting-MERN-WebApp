import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
import { cacheMiddleware } from '../../redis/cacheMiddleware.js';

router.route('/').get(cacheMiddleware, getProducts).post(protect, admin, cacheMiddleware, createProduct);
router.route('/:id/reviews').post(protect, cacheMiddleware, checkObjectId, createProductReview);
router.get('/top', cacheMiddleware, getTopProducts);
router
  .route('/:id')
  .get(cacheMiddleware, checkObjectId, getProductById)
  .put(protect, admin, cacheMiddleware, checkObjectId, updateProduct)
  .delete(protect, admin, cacheMiddleware, checkObjectId, deleteProduct);

export default router;
