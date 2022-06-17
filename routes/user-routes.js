const express = require('express');
const {postSignup,postLogin,postLogout} = require('../controllers/userController');


const router = express.Router();

router.post('/signup', postSignup);
router.post('/login', postLogin);
router.post('/logout', postLogout);



module.exports = {
    routes: router
}