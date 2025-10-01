import { Client } from "pg";

export async function handler( event) {
    
  const profileId = event.queryStringParameters?.profileId;

    if (!profileId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Missing profileId" }),
    };
  }
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const result = await client.query(
      "UPDATE profiles SET last_active = NOW() WHERE id = $1",
      [profileId]
    );

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
}
