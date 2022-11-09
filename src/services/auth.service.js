import { supabase } from '../supabaseClient';

export const signInWithMagiclink = async (email) => {
  const { user, session, error } = await supabase.auth.signInWithOtp({
    email,
  });
  if (session) return session;
};

export const signInWithEmailAndPassword = async (email, password) => {
  const { user, session, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (session) return session;
};

export const signUpNewUser = async (email, password) => {
  console.log(password);
  const { data, error } = await supabase.auth.signUp(
    {
      email,
      password,
    },
    {
      emailRedirectTo: window.location.href.replace('signup', 'userprofile'),
    }
  );
  console.log(data);
  console.log(error);
  if (data) return true;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
};
