const songService = require('../services/song.service');

/**
 * Get all songs for a band
 */
exports.getSongsForBand = async (req, res, next) => {
  try {
    const { bandId } = req.params;
    const songs = await songService.getSongsForBand(bandId);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single song by ID
 */
exports.getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await songService.getSongById(id);
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    res.status(200).json(song);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new song
 */
exports.createSong = async (req, res, next) => {
  try {
    const { bandId, title, artist, status, notes } = req.body;
    const userId = req.user.id;
    
    const newSong = await songService.createSong({
      bandId,
      title,
      artist,
      status: status || 'new',
      notes,
      addedBy: userId,
    });
    
    // Emit socket event
    const io = req.app.get('io');
    io.to(`band:${bandId}`).emit('song:created', newSong);
    
    res.status(201).json(newSong);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a song
 */
exports.updateSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, artist, status, notes } = req.body;
    
    const updatedSong = await songService.updateSong(id, {
      title,
      artist,
      status,
      notes,
    });
    
    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    // Emit socket event
    const io = req.app.get('io');
    io.to(`band:${updatedSong.bandId}`).emit('song:updated', updatedSong);
    
    res.status(200).json(updatedSong);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a song
 */
exports.deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await songService.getSongById(id);
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    await songService.deleteSong(id);
    
    // Emit socket event
    const io = req.app.get('io');
    io.to(`band:${song.bandId}`).emit('song:deleted', { id, bandId: song.bandId });
    
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a resource to a song
 */
exports.addSongResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resourceType, fileUrl, description } = req.body;
    const userId = req.user.id;
    
    const result = await songService.addSongResource(id, {
      resourceType,
      fileUrl,
      description,
      uploadedBy: userId,
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a song resource
 */
exports.deleteSongResource = async (req, res, next) => {
  try {
    const { songId, resourceId } = req.params;
    
    await songService.deleteSongResource(resourceId);
    
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    next(error);
  }
};
