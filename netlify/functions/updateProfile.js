import { Client } from "pg";

export async function handler(event) {
  try {
    console.log("updateProfile body:", event.body);
    const body = event.body ? JSON.parse(event.body) : {};
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
      console.log("updateProfile body:", event.body);
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
           unlocked_teams = COALESCE($7, unlocked_teams),
           titles = COALESCE($8, titles),
           selected_title = COALESCE($9, selected_title)
       WHERE id = $10
       RETURNING *`,
      [
        name,
        img,
        tournaments,
        trophies,
        victories,
        coins,
        unlocked_teams ? JSON.stringify(unlocked_teams) : null, // array → string
        titles ? JSON.stringify(titles) : null, // array → string
        selected_title,
        id,
      ]
    );

    await client.end();

    if (!result.rows.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: "Profile not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        profile: {
          ...result.rows[0],
          unlocked_teams: result.rows[0].unlocked_teams
            ? JSON.parse(result.rows[0].unlocked_teams)
            : [],
          titles: result.rows[0].titles
            ? JSON.parse(result.rows[0].titles)
            : [],
        },
      }),
    };
  } catch (err) {
    if (err.code === "23505") {
      throw new Error("Name already exists. Please choose another.");
    }
    console.error("Error in updateProfile:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
