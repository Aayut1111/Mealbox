import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AuthScreen() {
    const { signUp, signIn } = useAuth();
    const [mode, setMode] = useState("signin"); //signin | signup
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState("");
    const[notice, setNotice] = useState("");
    const[busy, setBusy] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setNotice("");
        setBusy(true);
        try {
            if (mode === "signup") {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setNotice("Account created - you're signed in.");

            }   else {
                const { error } = await signUp(email, password);
                if (error) throw error;

            }
        }   catch (err) {
            setError(err.message || "something went wrong.");
        }   finally {
            setBusy(false);
        }
    }

    return (
        <div className="auth-screen">
            <div className="auth-card">
                <h1>Mealbox</h1>
                <p className="auth-tagline">Your recipies, planned into a week.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <label htmlFor="auth-email">
                        Email
                        <input
                        id="auth-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                       />
                       </label>
                       <label htmlFor="auth-password">
                        Password
                            <input
                            id="auth-password"
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                       </label>
                       {error && <p className="auth-error">{error}</p>}
                       {notice && <p className="auth-notice">{notice}</p>}
                       <button types="submit" disabled={busy}>
                        {busy ? "please wait..." : mode === "signup" ? "create Account" : "Sign In"}
                       </button>
                       </form>
                       <button>
                        classname="auth-switch"
                        onClick={() => {
                            setMode(mode === "signup" ? "signin" : "signup");
                            setError("");
                            setNotice("");
                        }}
                        
                        {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
                        </button>
                        </div>
                        </div>
                       
    );
}