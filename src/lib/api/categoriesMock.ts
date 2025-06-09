import { CATEGORY_ID } from '@/lib/constants'
import { Category } from '@/lib/types/entityTypes'

const apiCategories: Category[] = [
  {
    id: CATEGORY_ID.CAT1,
    name: 'Regenwasser',
    iconPathSVG: 'icons/cookie.svg',
    iconSmall: 'icons/cookie-sm.png',
    iconMedium: 'icons/cookie-md.png',
    color: '#708090',
  },
  {
    id: CATEGORY_ID.CAT2,
    name: 'Brauchwasser',
    iconPathSVG: 'icons/cassette-tape.svg',
    iconSmall: 'icons/cassette-tape-sm.png',
    iconMedium: 'icons/cassette-tape-md.png',
    color: '#867e36',
  },
  {
    id: CATEGORY_ID.CAT3,
    name: 'Leitungswasser',
    iconPathSVG: 'icons/pocket-knife.svg',
    iconSmall: 'icons/pocket-knife-sm.png',
    iconMedium: 'icons/pocket-knife-md.png',
    color: '#0000ff',
  },
  {
    id: CATEGORY_ID.CAT4,
    name: 'Flußwasser',
    iconPathSVG: 'icons/package-plus.svg',
    iconSmall: 'icons/package-plus-sm.png',
    iconMedium: 'icons/package-plus-md.png',
    color: '#00008b',
  },
  {
    id: CATEGORY_ID.CAT5,
    name: 'anderes',
    iconPathSVG: 'icons/package-plus.svg',
    iconSmall: 'icons/package-plus-sm.png',
    iconMedium: 'icons/package-plus-md.png',
    color: '#08457e',
  },
  {
    id: CATEGORY_ID.CAT6,
    name: 'keine Angabe',
    iconPathSVG: 'icons/package-plus.svg',
    iconSmall: 'icons/package-plus-sm.png',
    iconMedium: 'icons/package-plus-md.png',
    color: '#111111',
  },
]

export default apiCategories
