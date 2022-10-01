import { supabase } from '../supabaseClient';

export const getMarkers = async () => {
  const { data, error } = await supabase.from('reports').select();

  if (error) console.log(error);

  if (data) return data;
};