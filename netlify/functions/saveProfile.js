import { Client } from "pg";

export async function handler(event) {
  const profileId = event.queryStringParameters?.profileId;

  if (!profileId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Missing profileId" }),
    };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Ensure table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT,
        tournaments INT DEFAULT 0,
        trophies INT DEFAULT 0,
        victories INT DEFAULT 0,
        img TEXT,
        coins INT DEFAULT 0,
        unlocked_teams TEXT DEFAULT '[]',
        titles TEXT[] DEFAULT '{}',
        selected_title TEXT,
      )
    `);

    let existing = await client.query(`SELECT * FROM profiles WHERE id=$1`, [profileId]);

    let profile;
    if (existing.rows.length === 0) {
      // Insert new profile with default values
      const result = await client.query(
        `INSERT INTO profiles (id, name, tournaments, trophies, victories, coins, unlocked_teams, img, titles , selected_title)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)
         RETURNING *`,
        [
          profileId,
          "Dummy",
          0, // tournaments
          0, // trophies
          0, // victories
          0, // coins
          JSON.stringify([]), // unlocked_teams
          "/assets/img/pak.png", // img
          [], // titles
          null
        ]
      );
      profile = result.rows[0];
    } else {
      profile = existing.rows[0]; // Return existing profile
    }

    await client.end();

    // Parse unlocked_teams before returning
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        profile: {
          ...profile,
          unlocked_teams: profile.unlocked_teams
            ? JSON.parse(profile.unlocked_teams)
            : [],
          titles: profile.titles || [],
        },
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  } finally {
    await client.end();
  }
}
