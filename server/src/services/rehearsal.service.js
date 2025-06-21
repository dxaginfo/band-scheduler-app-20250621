const db = require('../db');

/**
 * Get all rehearsals for a band
 */
exports.getRehearsalsForBand = async (bandId) => {
  const result = await db.query(
    `SELECT r.*, 
            json_agg(DISTINCT jsonb_build_object(
              'user_id', ra.user_id, 
              'status', ra.status, 
              'actual_attendance', ra.actual_attendance
            )) AS attendees,
            json_agg(DISTINCT jsonb_build_object(
              'song_id', rs.song_id,
              'priority', rs.priority
            )) AS songs
     FROM rehearsals r
     LEFT JOIN rehearsal_attendance ra ON r.id = ra.rehearsal_id
     LEFT JOIN rehearsal_songs rs ON r.id = rs.rehearsal_id
     WHERE r.band_id = $1
     GROUP BY r.id
     ORDER BY r.start_datetime`,
    [bandId]
  );
  
  return result.rows;
};

/**
 * Get a rehearsal by ID
 */
exports.getRehearsalById = async (id) => {
  const result = await db.query(
    `SELECT r.*, 
            json_agg(DISTINCT jsonb_build_object(
              'user_id', ra.user_id, 
              'status', ra.status, 
              'actual_attendance', ra.actual_attendance
            )) AS attendees,
            json_agg(DISTINCT jsonb_build_object(
              'song_id', rs.song_id,
              'priority', rs.priority
            )) AS songs
     FROM rehearsals r
     LEFT JOIN rehearsal_attendance ra ON r.id = ra.rehearsal_id
     LEFT JOIN rehearsal_songs rs ON r.id = rs.rehearsal_id
     WHERE r.id = $1
     GROUP BY r.id`,
    [id]
  );
  
  return result.rows[0];
};

/**
 * Create a new rehearsal
 */
exports.createRehearsal = async (rehearsalData) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Insert rehearsal
    const { bandId, title, location, startDateTime, endDateTime, notes, createdBy, songIds } = rehearsalData;
    
    const rehearsalResult = await client.query(
      `INSERT INTO rehearsals (band_id, title, location, start_datetime, end_datetime, notes, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [bandId, title, location, startDateTime, endDateTime, notes, createdBy]
    );
    
    const rehearsal = rehearsalResult.rows[0];
    
    // Add band members as attendees
    await client.query(
      `INSERT INTO rehearsal_attendance (rehearsal_id, user_id, status)
       SELECT $1, user_id, 'no_response'
       FROM band_members
       WHERE band_id = $2`,
      [rehearsal.id, bandId]
    );
    
    // Add songs to rehearsal if provided
    if (songIds && songIds.length > 0) {
      const songValues = songIds.map((songId, index) => 
        `($1, '${songId}', 'medium')`
      ).join(', ');
      
      await client.query(
        `INSERT INTO rehearsal_songs (rehearsal_id, song_id, priority)
         VALUES ${songValues}`,
        [rehearsal.id]
      );
    }
    
    await client.query('COMMIT');
    
    // Get complete rehearsal data
    return await this.getRehearsalById(rehearsal.id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Update a rehearsal
 */
exports.updateRehearsal = async (id, updateData) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Build the update query dynamically based on provided fields
    const { title, location, startDateTime, endDateTime, notes, status, songIds } = updateData;
    const updates = [];
    const values = [id];
    let valueIndex = 2;
    
    if (title !== undefined) {
      updates.push(`title = $${valueIndex++}`);
      values.push(title);
    }
    
    if (location !== undefined) {
      updates.push(`location = $${valueIndex++}`);
      values.push(location);
    }
    
    if (startDateTime !== undefined) {
      updates.push(`start_datetime = $${valueIndex++}`);
      values.push(startDateTime);
    }
    
    if (endDateTime !== undefined) {
      updates.push(`end_datetime = $${valueIndex++}`);
      values.push(endDateTime);
    }
    
    if (notes !== undefined) {
      updates.push(`notes = $${valueIndex++}`);
      values.push(notes);
    }
    
    if (status !== undefined) {
      updates.push(`status = $${valueIndex++}`);
      values.push(status);
    }
    
    updates.push(`updated_at = NOW()`);
    
    if (updates.length === 1) {
      // Only updated_at was added, nothing else to update
      await client.query('ROLLBACK');
      return await this.getRehearsalById(id);
    }
    
    // Update rehearsal
    const updateQuery = `
      UPDATE rehearsals 
      SET ${updates.join(', ')} 
      WHERE id = $1 
      RETURNING *
    `;
    
    const result = await client.query(updateQuery, values);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }
    
    // Update songs if provided
    if (songIds !== undefined) {
      // Remove existing song associations
      await client.query(
        'DELETE FROM rehearsal_songs WHERE rehearsal_id = $1',
        [id]
      );
      
      // Add new song associations
      if (songIds.length > 0) {
        const songValues = songIds.map((songId, index) => 
          `($1, '${songId}', 'medium')`
        ).join(', ');
        
        await client.query(
          `INSERT INTO rehearsal_songs (rehearsal_id, song_id, priority)
           VALUES ${songValues}`,
          [id]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Get complete rehearsal data
    return await this.getRehearsalById(id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Delete a rehearsal
 */
exports.deleteRehearsal = async (id) => {
  await db.query('DELETE FROM rehearsals WHERE id = $1', [id]);
};

/**
 * Update RSVP status for a user
 */
exports.updateRsvp = async (rehearsalId, userId, status) => {
  // First check if rehearsal exists and get band ID
  const rehearsalCheck = await db.query(
    'SELECT band_id FROM rehearsals WHERE id = $1',
    [rehearsalId]
  );
  
  if (rehearsalCheck.rows.length === 0) {
    return null;
  }
  
  // Update attendance record
  await db.query(
    `UPDATE rehearsal_attendance 
     SET status = $1 
     WHERE rehearsal_id = $2 AND user_id = $3`,
    [status, rehearsalId, userId]
  );
  
  return { bandId: rehearsalCheck.rows[0].band_id };
};

/**
 * Get upcoming rehearsals for a user
 */
exports.getUpcomingRehearsalsForUser = async (userId) => {
  const result = await db.query(
    `SELECT r.*, 
            json_agg(DISTINCT jsonb_build_object(
              'user_id', ra.user_id, 
              'status', ra.status, 
              'actual_attendance', ra.actual_attendance
            )) AS attendees,
            json_agg(DISTINCT jsonb_build_object(
              'song_id', rs.song_id,
              'priority', rs.priority
            )) AS songs,
            b.name as band_name
     FROM rehearsals r
     JOIN bands b ON r.band_id = b.id
     JOIN band_members bm ON b.id = bm.band_id
     LEFT JOIN rehearsal_attendance ra ON r.id = ra.rehearsal_id
     LEFT JOIN rehearsal_songs rs ON r.id = rs.rehearsal_id
     WHERE bm.user_id = $1 
       AND r.start_datetime > NOW()
       AND r.status = 'scheduled'
     GROUP BY r.id, b.name
     ORDER BY r.start_datetime`,
    [userId]
  );
  
  return result.rows;
};

/**
 * Update attendance records for a rehearsal
 */
exports.updateAttendance = async (rehearsalId, attendanceRecords) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Check if rehearsal exists
    const rehearsalCheck = await client.query(
      'SELECT id FROM rehearsals WHERE id = $1',
      [rehearsalId]
    );
    
    if (rehearsalCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }
    
    // Update each attendance record
    for (const record of attendanceRecords) {
      await client.query(
        `UPDATE rehearsal_attendance 
         SET actual_attendance = $1 
         WHERE rehearsal_id = $2 AND user_id = $3`,
        [record.attendance, rehearsalId, record.userId]
      );
    }
    
    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
