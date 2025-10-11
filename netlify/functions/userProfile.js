import { Client } from "pg";

export async function handler(event) {
  const profileId = event.queryStringParameters?.profileId;

      console.log("ID",profileId)
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(
      `
      SELECT 
        id, 
        name, 
        coins,
        trophies,
        unlocked_teams
      FROM profiles
      WHERE id = $1
      `,
      [profileId]
    );

    // Parse unlocked_teams JSON safely
    const profiles = result.rows.map((row) => ({
      ...row,
      unlocked_teams: row.unlocked_teams ? JSON.parse(row.unlocked_teams) : [],
    }));

      console.log("profilesssssssss",profiles[0])
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        profile: profiles[0] ,
      }),
    };
  } catch (err) {
    console.error("Database error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
      }),
    };
  } finally {
    await client.end();
  }
}
