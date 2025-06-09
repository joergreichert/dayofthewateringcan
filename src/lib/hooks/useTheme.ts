import { useCallback } from 'react'
import { spacing } from 'tailwindcss/defaultTheme'
import { RecursiveKeyValuePair, ResolvableTo } from 'tailwindcss/types/config'

import config from '@/root/tailwind.config'

const useAppTheme = () => {
  const { colors } = config.theme
  const color = useCallback(
    (key: string) => (colors as RecursiveKeyValuePair<string, string>)[key],
    [],
  )

  const space = useCallback((t: number) => {
    const number = `${t}` as keyof typeof spacing
    return spacing[number]
  }, [])

  return { space, color }
}

export default useAppTheme
