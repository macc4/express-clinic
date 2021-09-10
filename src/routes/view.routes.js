import express from 'express';
import viewController from '../controllers/view.controller.js';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getQueue);

router.get('/signin', authController.isLoggedIn, viewController.getSigninForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);

router.get(
  '/personal-resolutions',
  authController.protect,
  authController.isLoggedIn,
  viewController.getPersonalResolutions,
);

router.get(
  '/resolutions',
  authController.protect,
  authController.isLoggedIn,
  viewController.getAllResolutionsByName,
);

export default router;
