import { GeolocateControl, NavigationControl, ScaleControl } from 'react-map-gl'

import useAppTheme from '@/hooks/useTheme'

const MapControls = () => {
  const { space } = useAppTheme()

  return (
    <>
      <NavigationControl
        showCompass={false}
        position="bottom-right"
        style={{
          zIndex: 10,
          marginBottom: space(4),
          marginRight: space(4),
        }}
      />
      <GeolocateControl position="bottom-right" style={{ zIndex: 10, marginRight: space(4) }} />
    </>
  )
}

export default MapControls
