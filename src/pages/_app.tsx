import type { AppProps } from 'next/app'
import { Catamaran } from 'next/font/google'
import { QueryClient, QueryClientProvider } from 'react-query'

// custom version of 'maplibre-gl/dist/maplibre-gl.css'
import '@/map/maplibre-custom.css'
import '@/theme/globals.css'

const queryClient = new QueryClient()

const catamaran = Catamaran({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-catamaran',
})

const App = ({ Component, pageProps }: AppProps) => (
  <main className={`${catamaran.variable} font-sans text-dark`}>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  </main>
)

export default App
