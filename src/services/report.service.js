import { supabase } from '../supabaseClient';

export const getMarkers = async () => {
  const { data, error } = await supabase.from('reports').select();

  if (error) console.log(error);

  if (data) return data;
};


export const addReport = async (newReport) => {
  const { data, error } = await supabase.from('reports').insert([newReport])

  if (error) console.log(error);


}