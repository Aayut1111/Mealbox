import authedFetch from "./client";

export function fetchRecipes() {
  return authedFetch("/api/recipes");
}

export function createRecipe(recipe) {
  return authedFetch("/api/recipes", {
    method: "POST",
    body: JSON.stringify(recipe),
  });
}

export function deleteRecipe(id) {
  return authedFetch(`/api/recipes/${id}`, { method: "DELETE" });
}