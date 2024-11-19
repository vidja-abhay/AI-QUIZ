const express = require("express");
const User = require("../models/User.js");
const {loginUser, registerUser} = require("../controllers/AuthController.js")

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;