import express from 'express';
import Logo from '../models/Logo.js';

const router = express.Router();

// POST - Create a logo (or bulk insert by sending array in body)
router.post('/', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const logos = await Logo.insertMany(req.body);
      return res.status(201).json(logos);
    }
    const logo = await Logo.create(req.body);
    res.status(201).json(logo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET - Fetch all logos, optional filter by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const logos = await Logo.find(filter).sort({ name: 1 });
    res.json(logos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Remove logos by category (e.g. ?category=app) so you can re-seed
router.delete('/', async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ message: 'Query param category is required' });
    }
    const result = await Logo.deleteMany({ category });
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
