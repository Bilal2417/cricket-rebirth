import { Client } from "pg";

export async function handler() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(`
  SELECT id, name, trophies,
         (NOW() - last_active) < interval '1 minutes' AS is_active
  FROM profiles
  ORDER BY trophies DESC
`);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, profiles: result.rows }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
  finally {
  await client.end();
}
}
