import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        // 1. Get local session
        const { data: { session: localSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (localSession) {
            // 2. Key step: use getUser() to force check with Supabase Server if this Token is really valid
            const { data: { user: validatedUser }, error: userError } = await supabase.auth.getUser();

            if (userError || !validatedUser) {
                // If Token is invalid, force sign out and clear
                console.warn("Token invalid, forcing sign out");
                await supabase.auth.signOut();
                if (mounted) {
                    setSession(null);
                    setUser(null);
                }
            } else {
                // Token is valid, set states
                if (mounted) {
                    setSession(localSession);
                    setUser(validatedUser);
                }
            }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (mounted) {
            setSession(null);
            setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};