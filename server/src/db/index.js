const { Pool } = require('pg');

// Create a new pool of PostgreSQL connections
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'band_scheduler',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// Export query function
module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;

    // Override client.query to log queries
    client.query = (...args) => {
      console.log('QUERY:', args[0]);
      return query.apply(client, args);
    };

    // Override client.release to log releases and handle errors
    client.release = () => {
      console.log('Client released');
      return release.apply(client);
    };

    return client;
  },
};
