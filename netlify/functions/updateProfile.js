import { Client } from "pg";

export async function handler(event) {
    console.log(event.body)
  const { id, name, img, win_streak, trophies, victories } = JSON.parse(
    event.body
  );

  if (!id)
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Missing id" }),
    };

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const result = await client.query(
    `UPDATE profiles
     SET name=$1, img=$2, win_streak=$3, trophies=$4, victories=$5
     WHERE id=$6
     RETURNING *`,
    [name, img, win_streak, trophies, victories, id]
  );

  await client.end();

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, profile: result.rows[0] }),
  };
}
