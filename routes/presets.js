const express = require('express');
const passport = require("passport");
const Preset = require("../models/Preset");
const User = require("../models/User");
const Amplifier = require("../models/Amplifier");
const router = express.Router();

// TODO: GET /presets Retourner la liste des configurations (🔗 avec les données de l'utilisateur et l'ampli ⚙️ filtre par ampli + recherche partielle sur titre de musique)
router.get('/', async (req, res) => {
    try {
      let { amp, musicTitle } = req.query;
      let filters = {};
  
      if (amp) {
        filters.amp = amp;
      }
  
      if (musicTitle) {
        filters.musicTitle = { $regex: musicTitle, $options: 'i' };
      }
  
      const presets = await Preset.find(filters)
        .populate('user', 'username') 
        .populate('amp', 'modelName') 
        .exec();
  
      res.json(presets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// TODO: POST /presets Créer une nouvelle configuration (🔒 être connecté)

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const newPreset = new Preset(req.body);
      newPreset.user = req.user._id; 
      await newPreset.save();
  
      res.status(201).json(newPreset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// TODO: GET /presets/1 Récupérer les données d'une configuration (🔗 avec les données de l'utilisateur et l'ampli)
router.get('/:id', async (req, res) => {
    try {
      const presetId = req.params.id;
  
      const preset = await Preset.findById(presetId)
        .populate({
          path: 'user',
          select: 'username', 
        })
        .populate({
          path: 'amp',
          select: 'name', 
        })
        .exec();
  
      if (!preset) {
        return res.status(404).json({ error: 'Preset not found' });
      }
  
      res.json(preset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// TODO: PATCH /presets/1 Modifier les données d'une configuration (🔒 être connecté avec son propre compte ou admin)
router.patch('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const presetId = req.params.id;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';

        const preset = await Preset.findById(presetId);

        if (!preset) {
            return res.status(404).json({ error: 'Preset not found' });
        }

        if (preset.user.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        Object.keys(req.body).forEach(key => {
            preset[key] = req.body[key];
        });
        await preset.save();

        res.json(preset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// TODO: DELETE /presets/1 Supprimer les données d'une configuration (🔒 être connecté avec son propre compte ou admin)
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const presetId = req.params.id;
        const userId = req.user._id; 
        const isAdmin = req.user.role === 'admin';

        const preset = await Preset.findById(presetId);

        if (!preset) {
            return res.status(404).json({ error: 'Preset not found' });
        }

        if (preset.user.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await User.findByIdAndDelete(presetId);

        res.json({ message: 'Preset deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;