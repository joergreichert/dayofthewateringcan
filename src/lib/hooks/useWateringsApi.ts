import { supabase } from '@/src/lib/supabaseClient'

export const fetchWaterings = async () => {
  const { data, error } = await supabase.from('waterings').select('*')

  if (error) {
    throw new Error(error.message)
  }
}

export const saveWaterings = async () => {
  const { data, error } = await supabase.from('waterings').select('*')

  if (error) {
    throw new Error(error.message)
  }
}
