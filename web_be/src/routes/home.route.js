const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');

// Route cho trang chủ
router.get('/', homeController.getHomePage);

module.exports = router;