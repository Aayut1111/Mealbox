import { useEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import AuthScreen from "./components/AuthScreen";
import Header from "./components/Header";
import NavTabs from "./components/NavTabs";
import RecipesView from "./components/RecipesView";
import MealPlanView from "./components/MealPlanView";
import ShoppingListView from "./components/ShoppingListView";
import { fetchRecipes, createRecipe, deleteRecipe } from "./api/recipes";
import { fetchMealPlan, planRecipe, unplanRecipe } from "./api/mealPlan";

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("recipes");
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [dataState, setDataState] = useState("idle");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setDataState("loading");
    Promise.all([fetchRecipes(), fetchMealPlan()])
      .then(([r, m]) => {
        if (cancelled) return;
        setRecipes(r);
        setMealPlan(m);
        setDataState("ready");
      })
      .catch(() => {
        if (!cancelled) setDataState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  function flashToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  async function handleAddRecipe(recipe) {
    try {
      const saved = await createRecipe(recipe);
      setRecipes((prev) => [saved, ...prev]);
      flashToast(`Added "${saved.title}"`);
    } catch (e) {
      flashToast(e.message);
    }
  }

  async function handleDeleteRecipe(id) {
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      setMealPlan((prev) => prev.filter((m) => m.recipe_id !== id));
    } catch (e) {
      flashToast(e.message);
    }
  }

  async function handlePlan(recipeId, date) {
    try {
      const saved = await planRecipe(recipeId, date);
      setMealPlan((prev) => [...prev, saved]);
    } catch (e) {
      flashToast(e.message);
    }
  }

  async function handleUnplan(id) {
    try {
      await unplanRecipe(id);
      setMealPlan((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      flashToast(e.message);
    }
  }

  if (loading) return <div className="screen-center">Loading…</div>;
  if (!user) return <AuthScreen />;

  return (
    <div className="app-shell">
      <Header email={user.email} onSignOut={signOut} />
      <NavTabs active={activeTab} onChange={setActiveTab} />
      <main className="app-main">
        {dataState === "loading" && <p className="empty-state">Loading your kitchen…</p>}
        {dataState === "error" && (
          <p className="empty-state">Couldn't reach the server. Try reloading.</p>
        )}
        {dataState === "ready" && (
          <>
            {activeTab === "recipes" && (
              <RecipesView recipes={recipes} onAdd={handleAddRecipe} onDelete={handleDeleteRecipe} />
            )}
            {activeTab === "plan" && (
              <MealPlanView
                recipes={recipes}
                mealPlan={mealPlan}
                onPlan={handlePlan}
                onUnplan={handleUnplan}
              />
            )}
            {activeTab === "shopping" && (
              <ShoppingListView recipes={recipes} mealPlan={mealPlan} />
            )}
          </>
        )}
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}