const TABS = [
  { id: "recipes", label: "Recipes" },
  { id: "plan", label: "Meal Plan" },
  { id: "shopping", label: "Shopping List" },
];

export default function NavTabs({ active, onChange }) {
  return (
    <nav className="nav-tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`nav-tab${active === t.id ? " active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}