import authedFetch from "./client";

export function fetchMealPlan() {
  return authedFetch("/api/meal-plan");
}

export function planRecipe(recipeId, date) {
  return authedFetch("/api/meal-plan", {
    method: "POST",
    body: JSON.stringify({ recipe_id: recipeId, date }),
  });
}

export function unplanRecipe(id) {
  return authedFetch(`/api/meal-plan/${id}`, { method: "DELETE" });
}