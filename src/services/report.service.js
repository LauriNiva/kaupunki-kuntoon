import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const getPublicReports = async () => {
  const { data, error } = await supabase
    .from('reports')
    .select()
    .eq('public', true);

  if (error) console.log(error);

  if (data) return data;
};

export const getSingleReport = async (id) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*, departments(name)')
    .eq('id', id)
    .single();
  if (error) console.log(error);

  if (data) {
    if (data.departments?.name) data.department = data.departments.name;
    return data;
  }
};

export const getOwnReports = async (userid) => {
  const { data, error } = await supabase
    .from('reports')
    .select()
    .eq('user_id', userid);

  if (error) console.log('getOwnReports error:', error);

  if (data) return data;
};
export const getGroupReports = async (userid) => {
  const { data, error } = await supabase
    .from('reports')
    .select()
    .eq('user_id', userid);

  if (error) console.log('getGroupReports error:', error);

  if (data) return data;
};
export const getAllReports = async (userid) => {
  const { data, error } = await supabase.from('reports').select();

  if (error) console.log('getAllReports error:', error);

  if (data) return data;
};

export const addReport = async (newReport) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([newReport])
    .select();

  if (error) console.log(error);
  if (data) {
    console.log('New report added', data);
    return data;
  }
};

export const uploadImage = async (newImage) => {
  const imageName = `${uuidv4()}.${newImage.name.split('.').slice(-1)}`;

  const { data, error } = await supabase.storage
    .from('kaupunki-images')
    .upload(imageName, newImage);

  if (error) console.log(error);

  if (data) {
    return data.path;
  } else {
    return null;
  }
};
