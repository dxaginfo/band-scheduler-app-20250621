const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');
const { authenticate, authorizeBandRole } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all songs for a band
router.get('/band/:bandId', songController.getSongsForBand);

// Get a specific song
router.get('/:id', songController.getSongById);

// Create a new song
router.post('/', songController.createSong);

// Update a song
router.put('/:id', songController.updateSong);

// Delete a song
router.delete('/:id', songController.deleteSong);

// Add a resource to a song
router.post('/:id/resources', songController.addSongResource);

// Delete a resource from a song
router.delete('/:songId/resources/:resourceId', songController.deleteSongResource);

module.exports = router;
