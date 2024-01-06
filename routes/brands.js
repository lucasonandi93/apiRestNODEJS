const express = require('express');
const passport = require("passport");
const Brand = require("../models/Brand");
const router = express.Router();

// GET /brands Retourner la liste des marques
router.get('/', async (req, res) => {
  // #swagger.summary = 'Get all brands'
  // #swagger.description = 'Get all brands with name and logo'
  // #swagger.parameters['page'] = { description: 'Page number (default 0)', type: 'number' }
  // #swagger.parameters['limit'] = { description: 'Elements per page (default 2)', type: 'number' }
  let { page, limit } = req.query;
  page = isNaN(page) ? 1 : parseInt(page);
  limit = isNaN(limit) ? 2 : parseInt(limit);

  const brands = await Brand.find().limit(limit).skip((page - 1) * limit);
  const total = await Brand.countDocuments();

  res.json({
    page,
    "hydra:totalItems": total,
    brands
  });
});

// POST /brands Créer une nouvelle marque
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(402).json({ error: 'Unauthorized' });
  }
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (e) {
    res.status(400).json(e);
  }
});

// GET /brands/1 Récupérer les données d'une marque
router.get('/:id', async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if(brand) {
    res.json(brand);
  } else {
    res.status(404).json({ 'error': 'Can\'t find brand' });
  }
});

// PUT /brands/1 Mettre à jour une marque
router.put('/:id', async (req, res) => {
  const {name, logo} = req.body;
  let brand = await Brand.findById(req.params.id);
  brand.name = name;
  brand.logo = logo;
  try {
    await brand.save();
    res.status(200).json(brand);
  } catch (e) {
    res.status(400).json(e);
  }
});

// PATCH /brands/1 Mettre à jour une marque partiellement
router.patch('/:id', async (req, res) => {
  let brand = await Brand.findById(req.params.id);
  Object.assign(brand, req.body);
  try {
    await brand.save();
    res.status(200).json(brand);
  } catch (e) {
    res.status(400).json(e);
  }
});

// DELETE /brands/1 Supprimer une marque
router.delete('/:id', async (req, res) => {
  let brand = await Brand.findByIdAndDelete(req.params.id);
  if (brand) {
    res.status(204).json({ message: 'Brand successfully deleted!' });
  } else {
    res.status(404).json({ error: 'Brand not found!' });
  }
});

module.exports = router;