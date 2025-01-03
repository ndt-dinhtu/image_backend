const Category = require("../models/category");
const Image = require('../models/image');  

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .skip(req.query.skip || 0)
      .limit(req.query.limit || 10);
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const searchCategory = async (req, res) => {
  const { name } = req.query;
  try {
    const categories = await Category.find({ name: new RegExp(name, "i") });
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const images = await Image.find({ category: id });
    if (images.length > 0) {
      return res
        .status(400)
        .json({
          message:
            "Cannot delete category, there are images associated with it.",
        });
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = { createCategory, getCategories, searchCategory,deleteCategory,updateCategory };
