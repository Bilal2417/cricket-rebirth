import { Client } from "pg";
import ProfileData from "./profileData";

export async function handler(event, context) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Ensure table exists with UNIQUE name
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE,
        win_streak INT,
        trophies INT,
        victories INT,
        img TEXT
      )
    `);

    // Insert default profile if it doesn't exist
    const result = await client.query(
      `
      INSERT INTO profiles (name, win_streak, trophies, victories, img)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (name) DO NOTHING
      RETURNING *
      `,
      [
        ProfileData?.name ?? "Dummy",
        ProfileData?.records?.winStreak ?? 0,
        ProfileData?.records?.trophies ?? 0,
        ProfileData?.records?.victories ?? 0,
        ProfileData?.img ?? "/assets/img/pak.png",
      ]
    );

    // If INSERT did nothing (profile exists), fetch the existing one
    let profile;
    if (result.rows.length === 0) {
      const existing = await client.query(
        `SELECT * FROM profiles WHERE name = $1`,
        [ProfileData.name]
      );
      profile = existing.rows[0];
    } else {
      profile = result.rows[0];
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
