export default function ShoppingListView({ recipes, mealPlan }) {
  const plannedRecipeIds = new Set(mealPlan.map((m) => m.recipe_id));
  const plannedRecipes = recipes.filter((r) => plannedRecipeIds.has(r.id));

  const lines = new Set();
  plannedRecipes.forEach((r) => {
    (r.ingredients || "").split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed) lines.add(trimmed);
    });
  });
  const items = [...lines].sort((a, b) => a.localeCompare(b));

  return (
    <section className="view shopping-view">
      <p className="view-count">
        From {plannedRecipes.length} planned recipe{plannedRecipes.length === 1 ? "" : "s"} this
        week
      </p>
      {items.length === 0 ? (
        <p className="empty-state">Plan some recipes into your week to build a shopping list.</p>
      ) : (
        <ul className="shopping-list">
          {items.map((item, i) => (
            <li key={i}>
              <label>
                <input type="checkbox" />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}