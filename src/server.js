import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";

const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { useId, recipeId, title, iamge, cookTime, servings } = req.body;
    if (!userId || !recipeId || !titleId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        useId,
        recipeId,
        title,
        iamge,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("Error adding a favorite", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userFavorite = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    res.status(200).json(userFavorite);
  } catch (error) {
    console.log("Error fetching the favorite", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId))
        )
      );

    res.status(200).json({ success: "Favorite removed successfully." });
  } catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on PORT:5001");
});
