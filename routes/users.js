var express = require('express');
var router = express.Router();
const User = require('../models/User');
const passport = require('passport');

// TODO: GET /users Récupérer tous les utilisateurs (⚙️ filtre de recherche partielle sur le username)
router.get('/', async (req, res) => {
  // #swagger.summary = 'Get all users'
  // #swagger.description = 'Get all users'
  let{ page, limit, username} = req.query;
  let filters = {};

  page = isNaN(page) ? 1 : parseInt(page);
  limit = isNaN(limit) ? 2 : parseInt(limit);

  if (username) {
    filters.username = username;

  }

  const users = await User.find().populate('username').where(filters).limit(limit).skip((page - 1) * limit);
  const total = await User.countDocuments();
  res.json({
    page,
    "hydra:totalItems": total,
    "hydra:members": users
  });
});

// TODO: GET /users/1 Récupérer les données d'un utilisateur avec la liste de ses presets
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if(user) {
    res.json(user);
  } else {
    res.status(404).json({ 'error': 'Can\'t find amplifier' });
  }
});


// TODO: PATCH /users/1 Modifier les données d'un utilisateur (🔒 être connecté + uniquement sur son compte sauf si admin)

router.patch('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  if (req.user.role !== 'admin'){
    return res.status(402).json({ error: 'Unauthorized' });
  }
  let user = await User.findById(req.params.id);
  Object.assign(user, req.body);
  try {
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json(e);
  }
});
// TODO: DELETE /users/1 Supprimer les données d'un utilisateur (🔒 être connecté + uniquement sur son compte sauf si admin)

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const currentUser = req.user; 
    const userIdToDelete = req.params.id;

    const userToDelete = await User.findById(userIdToDelete);

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (currentUser.role !== 'admin' && currentUser._id.toString() !== userToDelete._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this user' });
    }

    await User.findByIdAndDelete(userIdToDelete);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});
module.exports = router;