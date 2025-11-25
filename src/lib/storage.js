import { supabase } from './supabase'

export const uploadImage = async (file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `novel-images/${fileName}`

  const { data, error } = await supabase.storage
    .from('novel-images')
    .upload(filePath, file)

  if (error) {
    throw new Error(error.message)
  }

  const { publicURL, error: urlError } = supabase.storage
    .from('novel-images')
    .getPublicUrl(filePath)

  if (urlError) {
    throw new Error(urlError.message)
  }

  return publicURL
}
