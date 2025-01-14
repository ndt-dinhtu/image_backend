 const Image = require("../models/image");
const Category = require("../models/category");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
    // cb(null, Date.now() + '-' + file.originalname);  
  },
});
const upload = multer({ storage: storage });
const getAllImages = async (req, res) => {
  try {
    const images = await Image.find()
      .populate("category")
      .skip(req.query.skip || 0)
      .limit(req.query.limit || 10);
    res.status(200).json(images);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const createImage = async (req, res) => {
  const { name, shortDescription, descriptionLink, categoryName } = req.body;
  if (!name || !shortDescription || !categoryName) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ giá trị" });
  }
  const imageUrl = req.file ? req.file.path : null;
  if (!imageUrl) {
    return res.status(400).json({ message: "Tệp hình ảnh là bắt buộc" });
  }
  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (req.file && !validImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Loại tập tin không hợp lệ" });
    }
    const image = new Image({
      name,
      shortDescription,
      descriptionLink,
      category: category._id,
      imageUrl,
    });

    await image.save();
    res.status(201).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau" });
  }
};

const getImagesByCategory = async (req, res) => {
  const { categoryName } = req.params;
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    const totalImages = await Image.countDocuments({ category: category._id });
    const totalPages = Math.ceil(totalImages / limit);

    const images = await Image.find({ category: category._id })
      .populate("category")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      images,
      totalPages,
      currentPage: Math.ceil((skip + 1) / limit),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const searchImageByName = async (req, res) => {
  const { name } = req.query;
  try {
    const images = await Image.find({ name: new RegExp(name, "i") }).populate(
      "category"
    );
    res.status(200).json(images);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image không tồn tại" });
    }
    if (image.imageUrl) {
      const imagePath = path.join(__dirname, "..", image.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Xóa image thất bại, lỗi: ", err);
        }
      });
    }
    await image.deleteOne();
    res.status(200).json({ message: "Xóa Image thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const updateImage = async (req, res) => {
  const { id } = req.params;
  const { name, shortDescription, descriptionLink, categoryName } = req.body;
  let imageUrl = req.file ? req.file.path : null;
  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Không tìm thấy Image" });
    }
    if (imageUrl && image.imageUrl) {
      const oldImagePath = path.join(__dirname, "..", image.imageUrl);
      fs.unlinkSync(oldImagePath);
    }
    image.name = name || image.name;
    image.shortDescription = shortDescription || image.shortDescription;
    image.descriptionLink = descriptionLink || image.descriptionLink;
    image.category = category._id;
    image.imageUrl = imageUrl || image.imageUrl;

    await image.save();
    res.status(200).json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createImage,
  getImagesByCategory,
  searchImageByName,
  upload,
  getAllImages,
  updateImage,
  deleteImage,
};
