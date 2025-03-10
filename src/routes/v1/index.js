import express from 'express' 
import productRoute from './productRoute.js'
import uploadRoute from './uploadRoute.js'
import categoryRoute from './categoryRoute.js'
import userRoute from './userRoute.js'
import cartRoute from './cartRoute.js'
import couponRoute from './couponRoute.js'
import shipRoute from './shipRoute.js'

const router = express.Router();

const defaultRoutes = [
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/images',
    route: uploadRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/carts',
    route: cartRoute,
  },
  {
    path: '/coupons',
    route: couponRoute,
  },
  {
    path: '/ships',
    route: shipRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router
