import { Client } from "pg";

export async function handler(event) {
  const profileId = event.queryStringParameters?.profileId;

  console.log("ID", profileId);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // ✅ Helper to safely parse JSON/array fields
  const parseField = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
      try {
        return JSON.parse(value);
      } catch {
        console.warn("Failed to parse field:", value);
      }
    }
    return [];
  };

  try {
    await client.connect();

    // ✅ Join profiles with contest table
    const result = await client.query(
      `
      SELECT 
        p.id, 
        p.name, 
        p.coins,
        p.trophies,
        p.trophydoubler,
        p.unlocked_teams,
        p.unlocked_items,
        p.victories,
        p.tournaments,
        p.titles,
        p.starter,
        COALESCE(c.points, 0) AS points,
        COALESCE(c.tickets, 0) AS tickets
      FROM profiles p
      LEFT JOIN contest c ON c.profile_id = p.id
      WHERE p.id = $1
      `,
      [profileId]
    );

    const profiles = result.rows.map((row) => ({
      ...row,
      unlocked_teams: parseField(row.unlocked_teams),
      unlocked_items: parseField(row.unlocked_items),
    }));

    console.log("✅ Final profile with contest:", profiles[0]);
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
