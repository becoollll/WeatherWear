import { supabase } from "../supabaseClient";

export async function loginWithEmailPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmailPassword(params: {
  email: string;
  password: string;
  username?: string;
  phone?: string;
}) {
  const { email, password, username, phone } = params;

  const SITE_URL = (import.meta.env.VITE_SITE_URL as string) ?? window.location.origin;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, phone },
      emailRedirectTo: SITE_URL + "/login",
    },
  });

  if (error) {
    console.error("signUp error:", error);
    return { data: null, error };
  }

  // after successful sign up, create a profile record
  try {
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,            // key: auth.users UUID
        email,
        username: username || null,
        phone: phone || null,
      });
    }
  } catch (profileErr) {
    console.warn("profiles upsert error:", profileErr);
    // don't let this error fail the entire sign up
  }

  return { data, error: null };
}

export async function logout() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function sendPasswordReset(email: string, options?: { redirectTo?: string }) {
  return supabase.auth.resetPasswordForEmail(email, options);
}