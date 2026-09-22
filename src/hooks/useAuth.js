import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useAuth() {
    const [session, setSession] = useState(undefined); //undefined = still loading

    useEffect(()=>{
        supabase.auth.getSession().then(({ data }) => setSession(data.session));
        const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });
        return () => listener.subscription.unsubscribe();

    }, []);

    return {
        session,
        user: session?.user ?? null,
        loading: session === undefined,
        signUp: (email, password) => supabase.auth.signUp({ email, password }),
        signIn: (email, password) => supabase.auth.signInWithPassword({email, password }),
        signOut: () => supabase.auth.signOut(),

    };
}