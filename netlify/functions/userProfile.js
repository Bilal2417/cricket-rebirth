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

    const result = await client.query(
      `
      SELECT 
        id, 
        name, 
        coins,
        trophies,
        trophydoubler,
        unlocked_teams,
        unlocked_items,
        victories,
        titles,
        starter
      FROM profiles
      WHERE id = $1
      `,
      [profileId]
    );

    const profiles = result.rows.map((row) => ({
      ...row,
      unlocked_teams: parseField(row.unlocked_teams),
      unlocked_items: parseField(row.unlocked_items),
    }));

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
