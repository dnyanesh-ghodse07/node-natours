const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

router.post('/signup',authController.signup);
router.post('/login',authController.login);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.postUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(authController.protect,userController.deleteUser);

module.exports = router;