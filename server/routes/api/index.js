const express = require('express');
const restaurantsControllers = require('../../controllers/restaurantControllers');
const updateControllers = require('../../controllers/updateControllers');
const downloadControllers = require('../../controllers/downloadControllers');

const router = express.Router();

router.get('/restaurants', restaurantsControllers.getRestaurants);
router.get('/update', updateControllers.post);
router.get('/download', downloadControllers.allData);

module.exports = router;
