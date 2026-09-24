import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { supabase } from './supabaseClient.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabse = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY

);

//Reads the logged-in user session token and attaches their user id.
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = data.user.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
// Recipes

app.get("/api/recipes", requireAuth, async (req, res) => {
    const { data, error } = await supabase 
    .from("recipes")
    .select("*")
    .eq("user_id", req.userId)
    .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post("/api/recipes", requireAuth, async (req, res) => {
    const {title, servings, ingredients, instructions } = req.body || {};
    if (!title) return res.status(400).json({ error: "title is required" });

    const { data, error } = await supabase
    .from("recipes")
    .insert([{ user_id: req.userId, title, servings, ingredients, instructions }])
    .select()
    .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

app.delete("/api/recipes/:id", requireAuth, async (req, res) => {
    const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", req.userId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).end();
});

//Meal plan

app.get("/api/meal-plan", requireAuth, async (req, res) => {
    const { data, error } = await supabase 
    .from("meal_plan_entries")
    .select("*, recipies(title)")
    .eq("user_id", req.userId)
    .order("date", {ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post("/api/meal-plan", requireAuth, async (req, res) => {
    const { recipe_id, date } = req.body || {};
    if (!recipe_id || !date) {
        return res.status(400).json({ error: "recipe_id and date are required"});

    }
    const { data, error } = await supabase
    .from("meal_plan_entries")
    .insert([{ user_id: req.userId, recipe_id, date }])
    .select("*, recipes(title)")
    .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);

});

app.delete("/api/meal-plan/:id", requireAuth, async (req, res) =>{
    const { error } = await supabase
    .from("meal_plan_entries")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", req.userId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).end();
});

const PORT = process.env.PORT || 5055;
app.listen(PORT, () => console.log('Mealbox backend running on :${PORT}'));