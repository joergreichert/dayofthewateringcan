import dynamic from 'next/dynamic'
import Head from 'next/head'

import EditableContextProvider from '@/lib/api/EditableContextProvider'

// import MapContainer from '@/map/MapContainer'

const MapContainer = dynamic(() => import('@/src/map/MapContainer'), { ssr: false })

const HomePage = () => (
  <div className="absolute overflow-hidden inset-0 bg-mapBg">
    <Head>
      <title>Tag der Gießkanne</title>
    </Head>
    <EditableContextProvider>
      <MapContainer />
    </EditableContextProvider>
  </div>
)

export default HomePage
