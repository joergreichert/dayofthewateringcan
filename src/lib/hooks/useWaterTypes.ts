import { useCallback, useRef } from 'react'

import apiWaterTypes from '@/lib/api/waterTypesMock'
import { WATER_TYPE_ID } from '@/lib/constants'

const useWaterTypes = () => {
  // use api call here
  const { current: waterTypes } = useRef(apiWaterTypes)

  const getWaterTypeById = useCallback(
    (id: WATER_TYPE_ID) => waterTypes.find(waterType => waterType.id === id),
    [waterTypes],
  )

  return { waterTypes, getWaterTypeById }
}

export default useWaterTypes
