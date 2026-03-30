import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mwrcmycualnfzssgdalc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cmNteWN1YWxuZnpzc2dkYWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4Mjc1MzUsImV4cCI6MjA5MDQwMzUzNX0.1f6WvecDUn9LNJSZ45nfdivsQkXY8O-0epjrA9oCefM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
