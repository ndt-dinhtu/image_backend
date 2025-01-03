const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');


router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/search', categoryController.searchCategory);
router.delete('/:id', categoryController.deleteCategory);
router.put('/:id', categoryController.updateCategory);


module.exports = router;
