const SUPABASE_URL = 'https://jaonriwecvyvnmyktuys.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphb25yaXdlY3Z5dm5teWt0dXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTc5MzIsImV4cCI6MjA4NjA3MzkzMn0.V-A1xzbjubjJBg7z6076WpVyRodYLBKgI90LwiqW4PY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabase;

console.log('Supabase configured with URL:', SUPABASE_URL);
