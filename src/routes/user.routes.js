import express from 'express';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/signout', authController.signOut);

// for registered users
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUserByID);

// for admins
router.use(authController.restrictTo(['admin', 'doctor']));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:userId')
  .get(userController.getUserByID)
  .delete(userController.deleteUserByID);

export default router;
