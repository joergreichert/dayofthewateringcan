import { WATER_TYPE_ID } from '@/lib/constants'
import { WaterType } from '@/lib/types/entityTypes'

const apiCategories: WaterType[] = [
  {
    id: WATER_TYPE_ID.RAINWATER,
    name: 'Regenwasser',
    iconPath: '/icons/watering-can.svg',
    color: '#708090',
  },
  {
    id: WATER_TYPE_ID.SERVICEWATER,
    name: 'Brauchwasser',
    iconPath: '/icons/watering-can.svg',
    color: '#867e36',
  },
  {
    id: WATER_TYPE_ID.TAPWATER,
    name: 'Leitungswasser',
    iconPath: '/icons/watering-can.svg',
    color: '#0000ff',
  },
  {
    id: WATER_TYPE_ID.RIVERWATER,
    name: 'Flußwasser',
    iconPath: '/icons/watering-can.svg',
    color: '#00008b',
  },
  {
    id: WATER_TYPE_ID.OTHER_WATER,
    name: 'anderes',
    iconPath: '/icons/watering-can.svg',
    color: '#08457e',
  },
  {
    id: WATER_TYPE_ID.NOT_SPECIFIED,
    name: 'keine Angabe',
    iconPath: '/icons/watering-can.svg',
    color: '#111111',
  },
]

export default apiCategories
