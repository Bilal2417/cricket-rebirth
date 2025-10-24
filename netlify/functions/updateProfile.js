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
      starter
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

    // --- Fetch existing profile ---
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
              ...(Array.isArray(current.unlocked_teams)
                ? current.unlocked_teams
                : typeof current.unlocked_teams === "string"
                ? JSON.parse(current.unlocked_teams || "[]")
                : current.unlocked_teams || []),
              ...(Array.isArray(unlocked_teams)
                ? unlocked_teams
                : [unlocked_teams]),
            ])
          )
        : current.unlocked_teams;

    // --- Merge unlocked_items ---
    const safeUnlockedItems =
      unlocked_items != null
        ? Array.from(
            new Set([
              ...(Array.isArray(current.unlocked_items)
                ? current.unlocked_items
                : typeof current.unlocked_items === "string"
                ? JSON.parse(current.unlocked_items || "[]")
                : current.unlocked_items || []),
              ...(Array.isArray(unlocked_items)
                ? unlocked_items
                : [unlocked_items]),
            ])
          )
        : current.unlocked_items;

    // Ensure "starter" always stays
    if (!safeUnlockedItems.includes("starter"))
      safeUnlockedItems.push("starter");

    // --- Merge titles ---
    const safeTitles =
      titles != null
        ? Array.from(
            new Set([
              ...(Array.isArray(current.titles)
                ? current.titles
                : typeof current.titles === "string"
                ? JSON.parse(current.titles || "[]")
                : current.titles || []),
              ...(Array.isArray(titles) ? titles : [titles]),
            ])
          )
        : current.titles;

    let safeTrophies = 0;
    if (typeof trophies === "number" && coins > 0) {
      safeTrophies = trophies < 0 ? 0 : trophies;
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
        safeTrophies ?? current.trophies,
        victories ?? null,
        coins ?? null,
        JSON.stringify(safeUnlockedTeams ?? []),
        JSON.stringify(safeTitles ?? []),
        selected_title ?? null,
        JSON.stringify(safeUnlockedItems ?? []),
        starter,
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
