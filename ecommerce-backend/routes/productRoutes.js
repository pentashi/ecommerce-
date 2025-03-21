const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET PRODUCTS WITH SEARCH & FILTER AND PAGINATION
router.get('/', async (req, res) => {
  const { search, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  const query = {};
  
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (minPrice || maxPrice) query.price = { $gte: minPrice || 0, $lte: maxPrice || Infinity };
  console.log("Query:", query); // Log the query to see if it's correct

  try {
    const totalCount = await Product.countDocuments(query); // Count total matching products
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      console.log("Products:", products); // Log products to verify if they're being fetched

    res.json({ products, totalCount }); // Return properly structured response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET A SINGLE PRODUCT
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE A PRODUCT
router.post('/', async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, stock } = req.body;
    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE A PRODUCT
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE A PRODUCT
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, stock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      { name, description, price, imageUrl, category, stock },
      { new: true } // Returns the updated product
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
