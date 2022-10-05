import { supabase } from "../supabaseClient";

export const signInWithEmail = async (email) => {
  const { user, error } = await supabase.auth.signIn({
    email
  });
}