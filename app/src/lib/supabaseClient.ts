import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  'https://dssgcccojtafppjtrzhn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzc2djY2NvanRhZnBwanRyemhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzgxOTUsImV4cCI6MjA1OTYxNDE5NX0.KK6tGvIv1X0dKz-s6OQtHfpK5jIMoscv6g6fqlfujXw',
)
