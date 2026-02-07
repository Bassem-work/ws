const SUPABASE_URL = 'https://jaonriwecvyvnmyktuys.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6Y2J2enZhd2Vib2V5YnJienp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTAyMTgsImV4cCI6MjA4NjA2NjIxOH0.mK0kYJtvspmq2gNkkQnOLxRBJS6l6wmum8t_eKKvq6U';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase configured with URL:', SUPABASE_URL);
