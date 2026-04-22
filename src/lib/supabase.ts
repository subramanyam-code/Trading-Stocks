import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ajqhzvgfruvtwmccpzcc.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJmNmNlYzA0LTExODctNGJmNy04NmE3LWVmMmVmZjkzYThmOCJ9.eyJwcm9qZWN0SWQiOiJhanFoenZnZnJ1dnR3bWNjcHpjYyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc2NzY3MTY0LCJleHAiOjIwOTIxMjcxNjQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.REbgFZVIQ5NSNMyd2YGRAsluMJoVdRKoqWWhI9EkoSc';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };