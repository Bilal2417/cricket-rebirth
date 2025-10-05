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
    console.log("Parsed", body);
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

    console.log("id", id, "type of", typeof id);
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

    // Check if profile exists
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

    // Optional: check name uniqueness if changing name
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

    const safeStringify = (val) => {
      if (val === undefined || val === null) return undefined;
      return typeof val === "string" ? val : JSON.stringify(val);
    };

    // Update only fields provided
    const result = await client.query(
      `UPDATE profiles
   SET name = COALESCE($1, name),
       img = COALESCE($2, img),
       tournaments = COALESCE($3, tournaments),
       trophies = COALESCE($4, trophies),
       victories = COALESCE($5, victories),
       coins = COALESCE($6, coins),
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
        selected_title ?? null,
        id,
      ]
    );

    await client.end();

    const updated = result.rows[0];

    const safeParse = (val) => {
      try {
        return val ? JSON.parse(val) : [];
      } catch (e) {
        return Array.isArray(val) ? val : [val]; // fallback to array
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        profile: {
          ...updated,
          selected_title: updated.selected_title || null, // explicitly return selected_title
        },
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
