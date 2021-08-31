import express from 'express';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// for admins
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers,
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUser,
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser,
  );

export default router;
