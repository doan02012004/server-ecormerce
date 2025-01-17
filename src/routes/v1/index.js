import express from 'express' 
import productRoute from './productRoute.js'
import uploadRoute from './uploadRoute.js'

const router = express.Router();

const defaultRoutes = [
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/images',
    route: uploadRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router
