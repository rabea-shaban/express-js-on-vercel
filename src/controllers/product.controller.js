const product = require("../models/product.model");

const getAll = async (req, res) => {
  try {
    const products = await product.find();
    res.status(200).json({
      message: "products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to fetch products",
      error: error.message,
    });
  }
};

const getById = async (req, res) => {
  const id = req.params.id;
  try {
    const products = await product.findById(id);
    res.status(200).json({
      message: "product fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to fetch product",
      error: error.message,
    });
  }
};

const deleteById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "No data found for the given ID." });
  }
  try {
    const products = await product.findByIdAndDelete(id);
    res.status(200).json({
      message: "product deleted successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to delete product",
      error: error.message,
    });
  }
};

const create = async (req, res) => {
  const { body, file } = req;
  try {
    const products = await product.create({
      ...body,
      image: file?.filename || null,
    });
    res.status(201).json({
      message: "product created successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to create product",
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = {
      ...req.body,
    };
    if (req.file) {
      updateData.image = req.file.filename;
    }
    const products = await product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!products) {
      return res.status(404).json({
        message: "product not found",
      });
    }
    return res.status(200).json({
      message: "product updated successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
