import { Router } from 'express';
import { createWishlist, getAllWishlists} from '../controllers/wishlist.controller.js';


const router = Router();

router.post('/createWishlist', createWishlist);
router.get('/getAllWishlists', getAllWishlists);

export default router;