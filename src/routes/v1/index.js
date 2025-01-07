import express from 'express' 
import productRoute from './productRoute.js'

const router = express.Router();

const defaultRoutes = [
  {
    path: '/products',
    route: productRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router
