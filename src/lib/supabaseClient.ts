import { createBrowserClient } from '@supabase/ssr'

import { WateringRaw } from './types/entityTypes'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export interface Database {
  public: {
    Tables: {
      waterings: {
        Row: WateringRaw
        Insert: WateringRaw
        Update: WateringRaw
      }
    }
  }
}

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function getSupabaseBrowserClient() {
  if (client) {
    return client
  }
  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  return client
}
