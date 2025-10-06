import { Client } from "pg";

export async function handler(event) {
  try {
    let body = {};
    try {
      body =
        typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (err) {
      console.error("Error parsing body:", event.body, err);
    }
    
    const {
      id,
      name,
      img,
      tournaments,
      trophies,
      victories,
      coins,
      unlocked_teams,
      titles,
      selected_title,
    } = body;

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

    const existingProfile = await client.query(
      `SELECT * FROM profiles WHERE id=$1`,
      [id]
    );

    if (!existingProfile.rows.length) {
      await client.end();
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: "Profile not found" }),
      };
    }

    if (name && name !== existingProfile.rows[0].name) {
      const check = await client.query(
        "SELECT id FROM profiles WHERE name = $1 AND id <> $2",
        [name, id]
      );
      if (check.rows.length > 0) {
        await client.end();
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: "Name already exists",
          }),
        };
      }
    }

    const result = await client.query(
      `UPDATE profiles
       SET name = COALESCE($1, name),
           img = COALESCE($2, img),
           tournaments = COALESCE($3, tournaments),
           trophies = COALESCE($4, trophies),
           victories = COALESCE($5, victories),
           coins = COALESCE($6, coins),
           unlocked_teams = COALESCE($7::jsonb, unlocked_teams),
           titles = COALESCE($8::jsonb, titles),
           selected_title = COALESCE($9, selected_title)
       WHERE id = $10
       RETURNING *`,
      [
        name ?? null,
        img ?? null,
        tournaments ?? null,
        trophies ?? null,
        victories ?? null,
        coins ?? null,
        unlocked_teams !== undefined ? JSON.stringify(unlocked_teams) : null,
        titles !== undefined ? JSON.stringify(titles) : existingProfile.rows[0].titles,
        selected_title ?? null,
        id,
      ]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        profile: result.rows[0],
      }),
    };
  } catch (err) {
    console.error("Error in updateProfile:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}