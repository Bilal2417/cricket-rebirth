import { Client } from "pg";

export async function handler(event) {
  const profileId = event.queryStringParameters?.profileId;

  console.log("ID:", profileId);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const parseField = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
      try {
        return JSON.parse(value);
      } catch {
        console.warn("⚠️ Failed to parse field:", value);
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
        battle_log
      FROM profiles
      WHERE id = $1
      `,
      [profileId]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          message: "Profile not found",
        }),
      };
    }

    const row = result.rows[0];
    const profile = {
      ...row,
      battle_log: parseField(row.battle_log),
    };

    console.log("✅ Final profile:", profile);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        profile,
      }),
    };
  } catch (err) {
    console.error("❌ Database error:", err);
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
