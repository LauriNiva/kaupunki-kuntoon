import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';


export const getMarkers = async () => {
  const { data, error } = await supabase.from('reports').select();

  if (error) console.log(error);

  if (data) return data;
};


export const addReport = async (newReport) => {
  const { data, error } = await supabase.from('reports').insert([newReport]).select();

  if (error) console.log(error);
  if (data) console.log(data);


}

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

}