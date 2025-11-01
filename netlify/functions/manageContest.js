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
        p.id,
        p.name,
        p.img,
        c.points,
        c.tickets
      FROM contest c
      JOIN profiles p ON c.profile_id = p.id
      ORDER BY c.points DESC;
    `);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        leaderboard: result.rows,
      }),
    };
  } catch (err) {
    console.error("Error fetching leaderboard:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
