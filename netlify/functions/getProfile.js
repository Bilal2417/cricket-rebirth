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
        -- coins,
        selected_title,
        (NOW() - last_active) < interval '1 minutes' AS is_active,
        COALESCE(img, '/assets/img/pak.png') AS img
      FROM profiles
      ORDER BY trophies DESC
    `);

    // Parse unlocked_teams JSON string into array before returning
    // const profiles = result.rows.map((row) => ({
    //   ...row,
    //   unlocked_teams: row.unlocked_teams ? JSON.parse(row.unlocked_teams) : [],
    //   titles: row.titles || [], // ensure always array
    // }));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, profiles : result.rows }),
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
