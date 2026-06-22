import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load the .env file so we can access DATABASE_URL
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  const email = '';
  const plainTextPassword = '';
  const name = 'Kelvin Juma';

  try {
    console.log('Generating secure hash...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    console.log('Inserting admin user...');
    await pool.query(
      `INSERT INTO users (email, password_hash, name) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO NOTHING`,
      [email, hashedPassword, name],
    );

    console.log('Success: Admin user successfully seeded!');
  } catch (error) {
    console.error('Fatal: Error seeding user:', error);
  } finally {
    await pool.end();
  }
}

seed();
