const express = require('express');
const restaurantsControllers = require('../../controllers/restaurantControllers');
const updateControllers = require('../../controllers/updateControllers');
// const downloadControllers = require('../../controllers/downloadControllers');
const searchControllers = require('../../controllers/dataControllers');

const router = express.Router();

router.get('/restaurants', restaurantsControllers.getRestaurants);

router.get('/update', updateControllers.post);

// router.get('/download', searchControllers.allData);

router.get('/data/search', searchControllers.getSearch);
router.get('/data/:dataId', searchControllers.getOneById);
router.get('/data', searchControllers.allData);
router.post('/data', searchControllers.create);


module.exports = router;
