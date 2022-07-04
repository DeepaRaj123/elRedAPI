const express = require('express');
const {verifyUser,postUserInfo,patchUserInfo,showwelcomeMessage} = require('../controllers/userController');
const AuthMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/verifyUser', verifyUser);
router.post('/postUserInfo',AuthMiddleware, postUserInfo);
router.patch('/patchUserInfo',AuthMiddleware, patchUserInfo);
router.get('/', showwelcomeMessage);

module.exports = {
    routes: router
}