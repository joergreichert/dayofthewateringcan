import { supabase } from '@/src/lib/supabaseClient'

import { Watering, WateringRaw } from '../types/entityTypes'

export const fetchWaterings = async (): Promise<Watering[]> => {
  const { data, error } = await supabase.from('waterings').select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const saveWaterings = async (watering: Watering) => {
  const { error } = await supabase.from('waterings').insert(watering)

  if (error) {
    throw new Error(error.message)
  }
}
