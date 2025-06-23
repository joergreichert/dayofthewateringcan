import Supercluster, { PointFeature } from 'supercluster'

import { WATER_TYPE_ID } from '@/lib/constants'

export type WaterType = {
  id: WATER_TYPE_ID
  name: string
  iconPath: string
  color: string
  hideInNav?: boolean
}

export type Bound = PointFeature<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [_: string]: any
}>

export type Cluster =
  | supercluster.PointFeature<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [_: string]: any
    }>
  | Supercluster.PointFeature<Supercluster.ClusterProperties & Supercluster.AnyProps>

export interface Watering {
  id?: number | undefined
  name: string | undefined
  liter: number | undefined
  date?: Date | string | undefined
  watertype: WATER_TYPE_ID
  longitude: number
  latitude: number
}

export interface WateringRaw {
  id?: number | undefined
  created: Date
  properties: Watering
  geom: GeoJSON.Point
}
