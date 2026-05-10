import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ldaezqygnybifycfuiyd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYWV6cXlnbnliaWZ5Y2Z1aXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODgwNDcsImV4cCI6MjA5Mzk2NDA0N30.3CupsyhSxXkdNIFNzn5C9Umm97p9Y0tnfDZoN2-b4rY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)