import { supabase } from "../supabaseClient";

export const signInWithMagiclink = async (email) => {
  const { user, session , error } = await supabase.auth.signInWithOtp({
    email
  });
  if(session) return session;
}

export const signInWithEmailAndPassword = async (email, password) => {
  const { user, session, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (session) return session;

}

export const signUpNewUser = async (email, username, password) => {
  const { user, session, error } = await supabase.auth.signUp({
    email,
    password,
  });
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
}