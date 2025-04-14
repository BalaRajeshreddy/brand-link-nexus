import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables from .env file
dotenv.config();

const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL environment variable not found.');
  process.exit(1);
}

console.log('Attempting to connect to database...');
console.log(`Using connection string: ${connectionString.replace(/:([^:@\/]+)@/, ':********@')}`); // Mask password for logging

const client = new Client({
  connectionString: connectionString,
  // Supabase requires SSL, but pg defaults might handle this.
  // Add ssl: { rejectUnauthorized: false } if needed, but be aware of security implications.
});

client.connect()
  .then(() => {
    console.log('✅ Successfully connected to the database!');
    client.end(); // Close the connection
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
    // Log the full error for more details if needed
    // console.error(err);
    client.end(); // Ensure connection is closed on error too
    process.exit(1); // Exit with error code
  });
