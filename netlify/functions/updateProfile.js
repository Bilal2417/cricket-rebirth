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
      battle_log, // ✅ add this from frontend
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

    // --- Parse JSON-safe arrays ---
    const parseArray = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    };

    // --- Merge unlocked_teams ---
    const safeUnlockedTeams =
      unlocked_teams != null
        ? Array.from(
            new Set([
              ...parseArray(current.unlocked_teams),
              ...parseArray(unlocked_teams),
            ])
          )
        : parseArray(current.unlocked_teams);

    // --- Merge unlocked_items ---
    const safeUnlockedItems =
      unlocked_items != null
        ? Array.from(
            new Set([
              ...parseArray(current.unlocked_items),
              ...parseArray(unlocked_items),
            ])
          )
        : parseArray(current.unlocked_items);

    // Always keep "starter"
    if (!safeUnlockedItems.includes("starter"))
      safeUnlockedItems.push("starter");

    // --- Merge titles ---
    const safeTitles =
      titles != null
        ? Array.from(
            new Set([...parseArray(current.titles), ...parseArray(titles)])
          )
        : parseArray(current.titles);

    // --- Safe trophies handling ---
    let safeTrophies =
      typeof trophies === "number" ? Math.max(0, trophies) : current.trophies;

    // --- ✅ Handle battle_log ---
    const currentBattleLog = parseArray(current.battle_log);

    let updatedBattleLog = currentBattleLog;

    if (battle_log) {
      // Push new entry at the start
      updatedBattleLog = [battle_log, ...currentBattleLog];

      // Limit to last 10
      if (updatedBattleLog.length > 10)
        // updatedBattleLog = updatedBattleLog.slice(0, 10);
        updatedBattleLog.pop();
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
           starter = COALESCE($11, starter),
           battle_log = COALESCE($12::jsonb, battle_log)
       WHERE id = $13
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
        JSON.stringify(updatedBattleLog),
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
