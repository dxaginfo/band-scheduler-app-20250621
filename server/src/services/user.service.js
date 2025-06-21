const db = require('../db');

/**
 * Get a user by ID
 */
exports.getUserById = async (id) => {
  const result = await db.query(
    'SELECT id, username, email, full_name, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  
  return result.rows[0];
};

/**
 * Get a user with their band memberships
 */
exports.getUserWithBands = async (id) => {
  const result = await db.query(
    `SELECT u.id, u.username, u.email, u.full_name, u.role, u.created_at, u.updated_at,
            json_agg(bm.band_id) AS bands
     FROM users u
     LEFT JOIN band_members bm ON u.id = bm.user_id
     WHERE u.id = $1
     GROUP BY u.id`,
    [id]
  );
  
  return result.rows[0];
};

/**
 * Check if a user has a specific role in a band
 */
exports.checkUserBandRole = async (userId, bandId, allowedRoles) => {
  const result = await db.query(
    'SELECT role FROM band_members WHERE user_id = $1 AND band_id = $2',
    [userId, bandId]
  );
  
  if (result.rows.length === 0) {
    return false;
  }
  
  return allowedRoles.includes(result.rows[0].role);
};

/**
 * Update a user's profile
 */
exports.updateUserProfile = async (id, profileData) => {
  const { username, email, fullName } = profileData;
  
  // Build update query based on provided fields
  const updates = [];
  const values = [id];
  let valueIndex = 2;
  
  if (username !== undefined) {
    updates.push(`username = $${valueIndex++}`);
    values.push(username);
  }
  
  if (email !== undefined) {
    updates.push(`email = $${valueIndex++}`);
    values.push(email);
  }
  
  if (fullName !== undefined) {
    updates.push(`full_name = $${valueIndex++}`);
    values.push(fullName);
  }
  
  updates.push(`updated_at = NOW()`);
  
  if (updates.length === 1) {
    // Only updated_at was added, nothing else to update
    return await this.getUserById(id);
  }
  
  const result = await db.query(
    `UPDATE users 
     SET ${updates.join(', ')} 
     WHERE id = $1 
     RETURNING id, username, email, full_name, role, created_at, updated_at`,
    values
  );
  
  return result.rows[0];
};

/**
 * Update a user's instruments
 */
exports.updateUserInstruments = async (userId, instrumentIds) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Remove existing instrument associations
    await client.query(
      'DELETE FROM user_instruments WHERE user_id = $1',
      [userId]
    );
    
    // Add new instrument associations
    if (instrumentIds.length > 0) {
      const values = instrumentIds.map((instrumentId, index) => 
        `($1, '${instrumentId}')`
      ).join(', ');
      
      await client.query(
        `INSERT INTO user_instruments (user_id, instrument_id)
         VALUES ${values}`,
        [userId]
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

/**
 * Get a user's instruments
 */
exports.getUserInstruments = async (userId) => {
  const result = await db.query(
    `SELECT i.id, i.name, ui.proficiency 
     FROM user_instruments ui
     JOIN instruments i ON ui.instrument_id = i.id
     WHERE ui.user_id = $1`,
    [userId]
  );
  
  return result.rows;
};
