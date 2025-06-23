import { supabase } from '@/src/lib/supabaseClient'

import { Watering, WateringRaw } from '../types/entityTypes'

export const fetchWaterings = () => async (): Promise<Watering[]> => {
  const { data, error } = await supabase.from('waterings').select('*')

  if (error) {
    throw new Error(error.message)
  }

  return (data as WateringRaw[]).map(raw => ({
    ...raw.properties,
    id: raw.id,
  }))
}

export const saveWaterings = async (watering: Watering) => {
  const wateringRaw: WateringRaw = {
    created: (watering.date && new Date(watering.date)) || new Date(),
    properties: watering,
    geom: {
      type: 'Point',
      coordinates: [watering.longitude, watering.latitude],
    },
  }
  const { error } = await supabase.from('waterings').insert(wateringRaw)

  if (error) {
    throw new Error(error.message)
  }
}
