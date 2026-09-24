import { useState } from "react";

export default function RecipesView({ recipes, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      servings: servings ? Number(servings) : null,
      ingredients,
      instructions,
    });
    setTitle("");
    setServings("");
    setIngredients("");
    setInstructions("");
    setShowForm(false);
  }

  return (
    <section className="view recipes-view">
      <div className="view-head">
        <p className="view-count">
          {recipes.length} recipe{recipes.length === 1 ? "" : "s"}
        </p>
        <button className="add-btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Add Recipe"}
        </button>
      </div>

      {showForm && (
        <form className="recipe-form" onSubmit={handleSubmit}>
          <input
            placeholder="Recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="Servings (optional)"
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
          <textarea
            placeholder="Ingredients, one per line"
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <textarea
            placeholder="Instructions"
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          <button type="submit" className="save-btn">
            Save Recipe
          </button>
        </form>
      )}

      {recipes.length === 0 && !showForm && (
        <p className="empty-state">No recipes yet — add your first one.</p>
      )}

      <div className="recipe-grid">
        {recipes.map((r) => (
          <article key={r.id} className="recipe-card">
            <div className="recipe-card-head">
              <h3>{r.title}</h3>
              <button
                className="delete-btn"
                onClick={() => onDelete(r.id)}
                aria-label={`Delete ${r.title}`}
              >
                ×
              </button>
            </div>
            {r.servings && <p className="recipe-servings">Serves {r.servings}</p>}
            {r.ingredients && (
              <p className="recipe-ingredients">
                {r.ingredients.split("\n").filter(Boolean).length} ingredients
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}