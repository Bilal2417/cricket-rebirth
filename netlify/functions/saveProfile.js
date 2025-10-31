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

    // ✅ Ensure profiles table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT,
        tournaments INT DEFAULT 0,
        trophydoubler INT DEFAULT 0,
        trophies INT DEFAULT 0,
        victories INT DEFAULT 0,
        img TEXT,
        coins INT DEFAULT 0,
        unlocked_teams JSONB DEFAULT '[]'::jsonb,
        unlocked_items JSONB DEFAULT '["starter"]'::jsonb,
        titles JSONB DEFAULT '[]'::jsonb,
        selected_title TEXT,
        starter BOOLEAN NOT NULL DEFAULT false,
        last_active TIMESTAMP DEFAULT NOW(),
        battle_log JSONB DEFAULT '[]'::jsonb
      )
    `);

    // ✅ Ensure battle_log column exists for older rows
    await client.query(`
      ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS battle_log JSONB DEFAULT '[]'::jsonb
    `);

    // ✅ Create contest table
await client.query(`
  CREATE TABLE IF NOT EXISTS contest (
    id SERIAL PRIMARY KEY,
    profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    points INT DEFAULT 0,
    tickets INT DEFAULT 0,
  )
`);

// ✅ For any existing profile without a contest record
await client.query(`
  INSERT INTO contest (profile_id, points, tickets)
  SELECT id, 0, 0
  FROM profiles
  WHERE id NOT IN (SELECT profile_id FROM contest)
`);


    // ✅ Ensure index for quick lookups (optional but recommended)
    // await client.query(`
    //   CREATE INDEX IF NOT EXISTS idx_contest_profile_day
    //   ON contest(profile_id, day);
    // `);

    // ✅ Get or create profile
    let existing = await client.query(`SELECT * FROM profiles WHERE id=$1`, [
      profileId,
    ]);

    let profile;
    if (existing.rows.length === 0) {
      const result = await client.query(
        `INSERT INTO profiles (
           id, name, tournaments, trophies, victories, coins, img,
           unlocked_teams, unlocked_items, titles, selected_title, starter, battle_log
         )
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         RETURNING *`,
        [
          profileId,
          "Dummy",
          0,
          0,
          0,
          0,
          null,
          JSON.stringify([]),
          JSON.stringify(["starter"]),
          JSON.stringify([]),
          null,
          false,
          JSON.stringify([]),
        ]
      );
      profile = result.rows[0];
    } else {
      profile = existing.rows[0];
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        profile,
      }),
    };
  } catch (err) {
    console.error("Error in getProfile:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
