const rehearsalService = require('../services/rehearsal.service');

/**
 * Get all rehearsals for a band
 */
exports.getRehearsalsForBand = async (req, res, next) => {
  try {
    const { bandId } = req.params;
    const rehearsals = await rehearsalService.getRehearsalsForBand(bandId);
    res.status(200).json(rehearsals);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single rehearsal by ID
 */
exports.getRehearsalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rehearsal = await rehearsalService.getRehearsalById(id);
    
    if (!rehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }
    
    res.status(200).json(rehearsal);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new rehearsal
 */
exports.createRehearsal = async (req, res, next) => {
  try {
    const { bandId, title, location, startDateTime, endDateTime, notes, songIds } = req.body;
    const userId = req.user.id;
    
    const newRehearsal = await rehearsalService.createRehearsal({
      bandId,
      title,
      location,
      startDateTime,
      endDateTime,
      notes,
      createdBy: userId,
      songIds,
    });
    
    // Emit socket event
    const io = req.app.get('io');
    io.to(`band:${bandId}`).emit('rehearsal:created', newRehearsal);
    
    res.status(201).json(newRehearsal);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a rehearsal
 */
exports.updateRehearsal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, location, startDateTime, endDateTime, notes, status, songIds } = req.body;
    
    const updatedRehearsal = await rehearsalService.updateRehearsal(id, {
      title,
      location,
      startDateTime,
      endDateTime,
      notes,
      status,
      songIds,
    });
    
    if (!updatedRehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }
    
    // Emit socket event
    const io = req.app.get('io');
    io.to(`band:${updatedRehearsal.bandId}`).emit('rehearsal:updated', updatedRehearsal);
    
    res.status(200).json(updatedRehearsal);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a rehearsal
 */
exports.deleteRehearsal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rehearsal = await rehearsalService.getRehearsalById(id);
    
    if (!rehearsal) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }
    
    await rehearsalService.deleteRehearsal(id);
    
    // Emit socket event
    const io = req.app.get('io');
    io.to(`band:${rehearsal.bandId}`).emit('rehearsal:deleted', { id, bandId: rehearsal.bandId });
    
    res.status(200).json({ message: 'Rehearsal deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * RSVP to a rehearsal
 */
exports.rsvpToRehearsal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    const result = await rehearsalService.updateRsvp(id, userId, status);
    
    if (!result) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }
    
    // Emit socket event
    const io = req.app.get('io');
    io.to(`band:${result.bandId}`).emit('rehearsal:rsvp', {
      rehearsalId: id,
      userId,
      status,
      bandId: result.bandId,
    });
    
    res.status(200).json({ message: 'RSVP updated successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get upcoming rehearsals for a user
 */
exports.getUpcomingRehearsals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const rehearsals = await rehearsalService.getUpcomingRehearsalsForUser(userId);
    res.status(200).json(rehearsals);
  } catch (error) {
    next(error);
  }
};

/**
 * Update attendance for a rehearsal
 */
exports.updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { attendanceRecords } = req.body;
    
    const result = await rehearsalService.updateAttendance(id, attendanceRecords);
    
    if (!result) {
      return res.status(404).json({ message: 'Rehearsal not found' });
    }
    
    res.status(200).json({ message: 'Attendance records updated successfully' });
  } catch (error) {
    next(error);
  }
};
