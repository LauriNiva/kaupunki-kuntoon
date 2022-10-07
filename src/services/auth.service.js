import { supabase } from "../supabaseClient";

export const signInWithMagiclink = async (email) => {
  const { user, session , error } = await supabase.auth.signIn({
    email
  });
}

export const signInWithEmailAndPassword = async (email, password) => {
  const { user, session, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export const signUpNewUser = async (email, username, password) => {
  const { user, session, error } = await supabase.auth.signInWithOtp({
    email,
    password,
  });
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
}