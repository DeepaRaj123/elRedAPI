const express = require('express');
const {verifyUser,postUserInfo,patchUserInfo} = require('../controllers/userController');
const AuthMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/verifyUser', verifyUser);
router.post('/postUserInfo',AuthMiddleware, postUserInfo);
router.patch('/patchUserInfo',AuthMiddleware, patchUserInfo);

module.exports = {
    routes: router
}