import { Client } from "pg";

export async function handler(event) {
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

    console.log("updateProfile body:", event.body);
    // Ensure table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        name TEXT,
        streak INT,
        trophies INT,
        victories INT,
        img TEXT
      )
    `);

    
    let existing = await client.query(`SELECT * FROM profiles WHERE id=$1`, [profileId]);

    let profile;
    if (existing.rows.length === 0) {
        
      const result = await client.query(
        `INSERT INTO profiles (id,name, streak, trophies, victories, img)
         VALUES ($1, $2, $3, $4, $5 , $6)
         RETURNING *`,
        [profileId,"Dummy", 0, 0, 0, "/assets/img/pak.png"]
      );
      profile = result.rows[0];
    } else {
      // Profile already exists → return it
      profile = existing.rows[0];
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, profile }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
