const express = require('express');

const router = express.Router()
const Controller = require('../controllers/userController');


/*User log in*/
router.post('/login', Controller.login)

/* Sign up*/
router.post('/signup', Controller.signupUser)

module.exports = router;