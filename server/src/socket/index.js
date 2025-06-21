/**
 * Socket.io setup and event handlers
 */
module.exports = (io) => {
  // Socket middleware for authentication
  io.use(require('./middleware/auth'));

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join user to their own room for private messages
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);
      
      // Join user to their band rooms
      if (socket.user.bands) {
        socket.user.bands.forEach(bandId => {
          socket.join(`band:${bandId}`);
        });
      }
    }

    // Handle rehearsal events
    socket.on('rehearsal:created', (data) => {
      io.to(`band:${data.bandId}`).emit('rehearsal:created', data);
    });

    socket.on('rehearsal:updated', (data) => {
      io.to(`band:${data.bandId}`).emit('rehearsal:updated', data);
    });

    socket.on('rehearsal:deleted', (data) => {
      io.to(`band:${data.bandId}`).emit('rehearsal:deleted', data);
    });

    socket.on('rehearsal:rsvp', (data) => {
      io.to(`band:${data.bandId}`).emit('rehearsal:rsvp', data);
    });

    // Handle song events
    socket.on('song:created', (data) => {
      io.to(`band:${data.bandId}`).emit('song:created', data);
    });

    socket.on('song:updated', (data) => {
      io.to(`band:${data.bandId}`).emit('song:updated', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
