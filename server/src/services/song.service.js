const db = require('../db');

/**
 * Get all songs for a band
 */
exports.getSongsForBand = async (bandId) => {
  const result = await db.query(
    `SELECT s.*, 
            json_agg(sr.*) FILTER (WHERE sr.id IS NOT NULL) AS resources
     FROM songs s
     LEFT JOIN song_resources sr ON s.id = sr.song_id
     WHERE s.band_id = $1
     GROUP BY s.id
     ORDER BY s.title`,
    [bandId]
  );
  
  return result.rows;
};

/**
 * Get a song by ID
 */
exports.getSongById = async (id) => {
  const result = await db.query(
    `SELECT s.*, 
            json_agg(sr.*) FILTER (WHERE sr.id IS NOT NULL) AS resources
     FROM songs s
     LEFT JOIN song_resources sr ON s.id = sr.song_id
     WHERE s.id = $1
     GROUP BY s.id`,
    [id]
  );
  
  return result.rows[0];
};

/**
 * Create a new song
 */
exports.createSong = async (songData) => {
  const { bandId, title, artist, status, notes, addedBy } = songData;
  
  const result = await db.query(
    `INSERT INTO songs (band_id, title, artist, status, notes, added_by) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [bandId, title, artist, status, notes, addedBy]
  );
  
  return { ...result.rows[0], resources: [] };
};

/**
 * Update a song
 */
exports.updateSong = async (id, updateData) => {
  // Build the update query dynamically based on provided fields
  const { title, artist, status, notes } = updateData;
  const updates = [];
  const values = [id];
  let valueIndex = 2;
  
  if (title !== undefined) {
    updates.push(`title = $${valueIndex++}`);
    values.push(title);
  }
  
  if (artist !== undefined) {
    updates.push(`artist = $${valueIndex++}`);
    values.push(artist);
  }
  
  if (status !== undefined) {
    updates.push(`status = $${valueIndex++}`);
    values.push(status);
  }
  
  if (notes !== undefined) {
    updates.push(`notes = $${valueIndex++}`);
    values.push(notes);
  }
  
  if (updates.length === 0) {
    // Nothing to update
    return await this.getSongById(id);
  }
  
  const updateQuery = `
    UPDATE songs 
    SET ${updates.join(', ')} 
    WHERE id = $1 
    RETURNING *
  `;
  
  const result = await db.query(updateQuery, values);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return await this.getSongById(id);
};

/**
 * Delete a song
 */
exports.deleteSong = async (id) => {
  await db.query('DELETE FROM songs WHERE id = $1', [id]);
};

/**
 * Add a resource to a song
 */
exports.addSongResource = async (songId, resourceData) => {
  const { resourceType, fileUrl, description, uploadedBy } = resourceData;
  
  // Check if song exists
  const songCheck = await db.query(
    'SELECT id FROM songs WHERE id = $1',
    [songId]
  );
  
  if (songCheck.rows.length === 0) {
    return null;
  }
  
  const result = await db.query(
    `INSERT INTO song_resources (song_id, resource_type, file_url, description, uploaded_by) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [songId, resourceType, fileUrl, description, uploadedBy]
  );
  
  return result.rows[0];
};

/**
 * Delete a song resource
 */
exports.deleteSongResource = async (resourceId) => {
  await db.query('DELETE FROM song_resources WHERE id = $1', [resourceId]);
};
