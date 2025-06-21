const express = require('express');
const router = express.Router();
const rehearsalController = require('../controllers/rehearsal.controller');
const { authenticate, authorizeBandRole } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all rehearsals for a band
router.get('/band/:bandId', rehearsalController.getRehearsalsForBand);

// Get a specific rehearsal
router.get('/:id', rehearsalController.getRehearsalById);

// Create a new rehearsal
router.post('/', rehearsalController.createRehearsal);

// Update a rehearsal
router.put('/:id', rehearsalController.updateRehearsal);

// Delete a rehearsal
router.delete('/:id', rehearsalController.deleteRehearsal);

// RSVP to a rehearsal
router.post('/:id/rsvp', rehearsalController.rsvpToRehearsal);

// Get upcoming rehearsals for the authenticated user
router.get('/user/upcoming', rehearsalController.getUpcomingRehearsals);

// Update attendance records for a rehearsal
router.post('/:id/attendance', rehearsalController.updateAttendance);

module.exports = router;
