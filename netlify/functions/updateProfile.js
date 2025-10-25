import { Client } from "pg";

export async function handler(event) {
  try {
    // --- Parse body safely ---
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
      unlocked_items,
      starter,
    } = body;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing id" }),
      };
    }

    // --- DB Connection ---
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    // --- Helper function to safely parse arrays ---
    const parseSafe = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch {
          return [];
        }
      }
      return [];
    };

    // --- Fetch existing profile ---
    const existingProfile = await client.query(
      `SELECT * FROM profiles WHERE id = $1`,
      [id]
    );

    if (!existingProfile.rows.length) {
      await client.end();
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: "Profile not found" }),
      };
    }

    const current = existingProfile.rows[0];

    // --- Check if new name is unique ---
    if (name && name !== current.name) {
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

    // --- Merge unlocked_teams ---
    const safeUnlockedTeams =
      unlocked_teams != null
        ? Array.from(
            new Set([
              ...parseSafe(current.unlocked_teams),
              ...parseSafe(unlocked_teams),
            ])
          )
        : parseSafe(current.unlocked_teams);

    // --- Merge unlocked_items ---
    const safeUnlockedItems =
      unlocked_items != null
        ? Array.from(
            new Set([
              ...parseSafe(current.unlocked_items),
              ...parseSafe(unlocked_items),
            ])
          )
        : parseSafe(current.unlocked_items);

    // Always keep "starter"
    if (!safeUnlockedItems.includes("starter"))
      safeUnlockedItems.push("starter");

    // --- Merge titles ---
    const safeTitles =
      titles != null
        ? Array.from(
            new Set([...parseSafe(current.titles), ...parseSafe(titles)])
          )
        : parseSafe(current.titles);

    // --- Safe trophies ---
    // const safeTrophies =
    //   typeof trophies === "number" ? Math.max(0, trophies) : current.trophies;

    let safeTrophies = 0;
    if (typeof trophies === "number" && coins > 0) {
      safeTrophies = trophies < 0 ? 0 : trophies;
    } else {
      safeTrophies = trophies;
    }

    // --- Update profile ---
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
           selected_title = COALESCE($9, selected_title),
           unlocked_items = COALESCE($10::jsonb, unlocked_items),
           starter = COALESCE($11, starter)
       WHERE id = $12
       RETURNING *`,
      [
        name ?? null,
        img ?? null,
        tournaments ?? null,
        safeTrophies,
        victories ?? null,
        coins ?? null,
        JSON.stringify(safeUnlockedTeams),
        JSON.stringify(safeTitles),
        selected_title ?? null,
        JSON.stringify(safeUnlockedItems),
        starter ?? current.starter,
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
