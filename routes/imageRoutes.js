const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');


router.post('/', imageController.upload.single('image'), imageController.createImage);
router.get('/', imageController.getAllImages);
router.get('/category/:categoryName', imageController.getImagesByCategory);
router.get('/search', imageController.searchImageByName);
router.delete('/:id', imageController.deleteImage);
router.put('/:id', imageController.upload.single('image'), imageController.updateImage);


module.exports = router;
