import { supabase } from "../supabaseClient";

export async function loginWithEmailPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmailPassword(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
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