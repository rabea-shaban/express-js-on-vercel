const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");

const getAll = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const { body, file } = req;

    if (!file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const { name, description } = body;

    const category = await Category.create({
      name,
      description,
      image: file.filename,
    });

    return res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

const getByID = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    res.status(200).json({
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
    };

    // لو فيه صورة جديدة
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // delete image لو موجودة
    if (category.image) {
      const imagePath = path.join("uploads", category.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getAll,
  create,
  getByID,
  update,
  deleteById,
};
