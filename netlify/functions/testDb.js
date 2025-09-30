import 'dotenv/config'; 
import { Client } from 'pg';

export async function handler() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, 
  });

  try {
    await client.connect();
    const res = await client.query('SELECT NOW() AS time;');
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, time: res.rows[0].time }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
}
