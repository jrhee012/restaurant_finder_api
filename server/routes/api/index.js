const express = require('express');
const restaurantsControllers = require('../../controllers/restaurantControllers');

const router = express.Router();

router.get('/restaurants', restaurantsControllers.getRestaurants);

module.exports = router;
