import express from 'express';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.login);
router.get('/signout', authController.signOut);

// for registered users
router.use(authController.protect);

router.get('/account', userController.getMe, userController.getUser);

// for admins
// router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:userId')
  .get(userController.getUser)
  .delete(userController.deleteUser);

export default router;
