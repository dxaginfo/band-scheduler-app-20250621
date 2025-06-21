require('dotenv').config();
const db = require('./index');

/**
 * Database setup script to initialize schema and tables
 */
async function setupDatabase() {
  try {
    const client = await db.getClient();

    try {
      // Start transaction
      await client.query('BEGIN');

      console.log('Setting up database schema...');

      // Create users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password_hash VARCHAR(100) NOT NULL,
          full_name VARCHAR(100),
          role VARCHAR(20) NOT NULL DEFAULT 'member',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Create bands table
      await client.query(`
        CREATE TABLE IF NOT EXISTS bands (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Create band_members table (many-to-many relationship)
      await client.query(`
        CREATE TABLE IF NOT EXISTS band_members (
          band_id UUID NOT NULL REFERENCES bands(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(20) NOT NULL DEFAULT 'member',
          joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
          PRIMARY KEY (band_id, user_id)
        );
      `);

      // Create instruments table
      await client.query(`
        CREATE TABLE IF NOT EXISTS instruments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(50) NOT NULL UNIQUE
        );
      `);

      // Create user_instruments table (many-to-many relationship)
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_instruments (
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          instrument_id UUID NOT NULL REFERENCES instruments(id) ON DELETE CASCADE,
          proficiency VARCHAR(20),
          PRIMARY KEY (user_id, instrument_id)
        );
      `);

      // Create availability table
      await client.query(`
        CREATE TABLE IF NOT EXISTS availability (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          day_of_week INTEGER,
          start_time TIME,
          end_time TIME,
          recurrence VARCHAR(20) DEFAULT 'weekly',
          CONSTRAINT check_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6)
        );
      `);

      // Create conflicts table
      await client.query(`
        CREATE TABLE IF NOT EXISTS conflicts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          start_datetime TIMESTAMP NOT NULL,
          end_datetime TIMESTAMP NOT NULL,
          reason TEXT
        );
      `);

      // Create rehearsals table
      await client.query(`
        CREATE TABLE IF NOT EXISTS rehearsals (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          band_id UUID NOT NULL REFERENCES bands(id) ON DELETE CASCADE,
          title VARCHAR(100) NOT NULL,
          location VARCHAR(100) NOT NULL,
          start_datetime TIMESTAMP NOT NULL,
          end_datetime TIMESTAMP NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
          notes TEXT,
          created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Create rehearsal_attendance table
      await client.query(`
        CREATE TABLE IF NOT EXISTS rehearsal_attendance (
          rehearsal_id UUID NOT NULL REFERENCES rehearsals(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(20) NOT NULL DEFAULT 'no_response',
          actual_attendance VARCHAR(20),
          PRIMARY KEY (rehearsal_id, user_id)
        );
      `);

      // Create songs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS songs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          band_id UUID NOT NULL REFERENCES bands(id) ON DELETE CASCADE,
          title VARCHAR(100) NOT NULL,
          artist VARCHAR(100),
          status VARCHAR(20) NOT NULL DEFAULT 'new',
          notes TEXT,
          added_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          added_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Create song_resources table
      await client.query(`
        CREATE TABLE IF NOT EXISTS song_resources (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
          resource_type VARCHAR(20) NOT NULL,
          file_url TEXT NOT NULL,
          description TEXT,
          uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Create rehearsal_songs table (many-to-many relationship)
      await client.query(`
        CREATE TABLE IF NOT EXISTS rehearsal_songs (
          rehearsal_id UUID NOT NULL REFERENCES rehearsals(id) ON DELETE CASCADE,
          song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
          priority VARCHAR(20) NOT NULL DEFAULT 'medium',
          PRIMARY KEY (rehearsal_id, song_id)
        );
      `);

      // Create setlists table
      await client.query(`
        CREATE TABLE IF NOT EXISTS setlists (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          band_id UUID NOT NULL REFERENCES bands(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          event_date DATE,
          created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Create setlist_songs table (many-to-many relationship with order)
      await client.query(`
        CREATE TABLE IF NOT EXISTS setlist_songs (
          setlist_id UUID NOT NULL REFERENCES setlists(id) ON DELETE CASCADE,
          song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
          position INTEGER NOT NULL,
          PRIMARY KEY (setlist_id, song_id)
        );
      `);

      // Insert default instruments
      await client.query(`
        INSERT INTO instruments (name) VALUES 
        ('Lead Guitar'),
        ('Rhythm Guitar'),
        ('Bass'),
        ('Drums'),
        ('Keyboard'),
        ('Piano'),
        ('Vocals'),
        ('Saxophone'),
        ('Trumpet'),
        ('Violin'),
        ('Cello'),
        ('Flute'),
        ('Harmonica')
        ON CONFLICT (name) DO NOTHING;
      `);

      // Commit transaction
      await client.query('COMMIT');

      console.log('Database setup completed successfully');
    } catch (err) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      throw err;
    } finally {
      // Release client back to pool
      client.release();
    }
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}

// Run the setup function
setupDatabase();
