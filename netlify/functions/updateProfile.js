import { Client } from "pg";

export async function handler(event) {
  try {
    console.log("updateProfile body:", event.body);
    const body = event.body ? JSON.parse(event.body) : {};
    const { id, name, img, tournaments, trophies, victories } = body;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing id" }),
      };
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    const result = await client.query(
      `UPDATE profiles
       SET name=$1, img=$2, tournaments=$3, trophies=$4, victories=$5
       WHERE id=$6
       RETURNING *`,
      [name, img, tournaments, trophies, victories, id]
    );

    await client.end();

    // If no rows were updated, return 404
    if (!result.rows.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: "Profile not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, profile: result.rows[0] }),
    };
  } catch (err) {
    console.error("Error in updateProfile:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
