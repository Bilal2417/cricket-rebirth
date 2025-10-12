import { Client } from "pg";

export async function handler(event) {
  const profileId = event.queryStringParameters?.profileId;

  console.log("ID", profileId);
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
        trophydoubler,
        unlocked_teams
      FROM profiles
      WHERE id = $1
      `,
      [profileId]
    );

    const profiles = result.rows.map((row) => {
      let unlockedTeams = [];

      try {
        if (Array.isArray(row.unlocked_teams)) {
          // ✅ Already parsed JSONB array
          unlockedTeams = row.unlocked_teams;
        } else if (typeof row.unlocked_teams === "string" && row.unlocked_teams.trim() !== "") {
          // ✅ Stored as JSON string
          unlockedTeams = JSON.parse(row.unlocked_teams);
        }
      } catch (e) {
        console.warn("Failed to parse unlocked_teams JSON for row:", row.id, e);
        unlockedTeams = [];
      }

      return {
        ...row,
        unlocked_teams: unlockedTeams,
      };
    });

    console.log("✅ Final profile:", profiles[0]);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        profile: profiles[0],
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
