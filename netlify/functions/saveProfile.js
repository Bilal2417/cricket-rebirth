import { Client } from "pg";
import ProfileData from "../../src/components/profileData";

export async function handler(event, context) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Make sure table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        name TEXT,
        win_streak INT,
        trophies INT,
        victories INT,
        img TEXT
      )
    `);

    // Insert default profile
    const result = await client.query(
      `INSERT INTO profiles (name, win_streak, trophies, victories, img)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        ProfileData.name,
        ProfileData.records.winStreak,
        ProfileData.records.trophies,
        ProfileData.records.victories,
        ProfileData.img
      ]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, profile: result.rows[0] }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
