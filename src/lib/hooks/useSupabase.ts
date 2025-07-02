import { useMemo } from 'react'

import { getSupabaseBrowserClient } from '@/lib/supabaseClient'

function useSupabase() {
  return useMemo(getSupabaseBrowserClient, [])
}

export default useSupabase
