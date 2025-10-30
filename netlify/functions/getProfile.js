import { Client } from "pg";

export async function handler() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT 
        id, 
        name, 
        trophies,
        unlocked_teams,
        selected_title,
        victories,
        tournaments,
        selected_title,
        last_active ,
      img
      FROM profiles
      ORDER BY trophies DESC
    `);

    const profiles = result.rows.map((row) => {
      let unlockedTeams = [];

      try {
        if (Array.isArray(row.unlocked_teams)) {
          // ✅ Already parsed JSONB array
          unlockedTeams = row.unlocked_teams;
        } else if (
          typeof row.unlocked_teams === "string" &&
          row.unlocked_teams.trim() !== ""
        ) {
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        profiles,
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
