const db = require('../db');

/**
 * Find a user by email
 */
exports.findUserByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  
  return result.rows[0];
};

/**
 * Register a new user
 */
exports.registerUser = async (userData) => {
  const { username, email, password, fullName, role } = userData;
  
  const result = await db.query(
    `INSERT INTO users (username, email, password_hash, full_name, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, username, email, full_name, role, created_at, updated_at`,
    [username, email, password, fullName, role]
  );
  
  return result.rows[0];
};
