import { Client } from "pg";

export async function handler(event) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Ensure table exists
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

    // Check if any profile exists (you could also filter by some unique identifier if needed)
    const existing = await client.query(`SELECT * FROM profiles LIMIT 1`);

    let profile;
    if (existing.rows.length === 0) {
      // No profile exists → create a default one
      const result = await client.query(
        `INSERT INTO profiles (name, winStreak, trophies, victories, img)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        ["Dummy", 0, 0, 0, "/assets/img/pak.png"]
      );
      profile = result.rows[0];
    } else {
      // Profile already exists → return it
      profile = existing.rows[0];
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, profile }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
