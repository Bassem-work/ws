
  // Initialize Supabase client
  const supabaseUrl ='https://jaonriwecvyvnmyktuys.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6Y2J2enZhd2Vib2V5YnJienp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTAyMTgsImV4cCI6MjA4NjA2NjIxOH0.mK0kYJtvspmq2gNkkQnOLxRBJS6l6wmum8t_eKKvq6U';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const matricule = document.getElementById('matricule').value;
    const password = document.getElementById('password').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    successMessage.classList.remove('show');
    successMessage.textContent = '';

    try {
      const { data: existingEmployee } = await supabase
        .from('employees')
        .select('matricule')
        .eq('matricule', matricule)
        .maybeSingle();

      if (existingEmployee) {
        errorMessage.textContent = 'Ce matricule existe déjà';
        errorMessage.classList.add('show');
        return;
      }

      const { data, error } = await supabase
        .from('employees')
        .insert([{ matricule, password, nom, prenom }])
        .select();

      if (error) throw error;

      successMessage.textContent = 'Compte créé avec succès! Redirection...';
      successMessage.classList.add('show');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      errorMessage.textContent = 'Erreur lors de la création du compte. Veuillez réessayer.';
      errorMessage.classList.add('show');
    }
  });