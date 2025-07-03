import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '../supabaseClient'
import { Watering, WateringRaw } from '../types/entityTypes'

export const fetchWaterings = async (
  supabase: SupabaseClient<Database, 'public', any>,
): Promise<Watering[]> => {
  const { data, error } = await supabase.from('waterings').select('*').gte('created', '2025-07-04')

  if (error) {
    throw new Error(error.message)
  }

  return (data as WateringRaw[]).map(raw => ({
    ...raw.properties,
    id: raw.id,
  }))
}

export const saveWatering = async (
  supabase: SupabaseClient<Database, 'public', any>,
  watering: Watering,
) => {
  const wateringRaw: WateringRaw[] = [
    {
      created: (watering.date && new Date(watering.date)) || new Date(),
      properties: watering,
      geom: {
        type: 'Point',
        coordinates: [watering.longitude, watering.latitude],
      },
    },
  ]
  const { error } = await supabase.from('waterings').insert(wateringRaw)
  if (error) {
    throw new Error(error.message)
  }
}
