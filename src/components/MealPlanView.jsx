import { getWeekDates, dateKey, formatDayLabel } from "../utils/week";

export default function MealPlanView({ recipes, mealPlan, onPlan, onUnplan }) {
  const week = getWeekDates();

  function entriesFor(key) {
    return mealPlan.filter((m) => m.date === key);
  }

  return (
    <section className="view plan-view">
      {recipes.length === 0 && (
        <p className="empty-state">Add a recipe first, then plan it into your week.</p>
      )}
      <div className="week-grid">
        {week.map((date) => {
          const key = dateKey(date);
          const entries = entriesFor(key);
          return (
            <div key={key} className="day-card">
              <h4>{formatDayLabel(date)}</h4>
              {entries.map((e) => (
                <div key={e.id} className="planned-recipe">
                  <span>{e.recipes?.title || "Recipe"}</span>
                  <button onClick={() => onUnplan(e.id)} aria-label="Remove">
                    ×
                  </button>
                </div>
              ))}
              {recipes.length > 0 && (
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      onPlan(e.target.value, key);
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="" disabled>
                    + Add recipe
                  </option>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}