document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const matricule = document.getElementById('matricule').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.classList.remove('show');
    errorMessage.textContent = '';

    try {
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .eq('matricule', matricule)
            .eq('password', password)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            errorMessage.textContent = 'Matricule ou mot de passe incorrect';
            errorMessage.classList.add('show');
            return;
        }

        sessionStorage.setItem('employeeId', data.id);
        sessionStorage.setItem('employeeName', `${data.prenom} ${data.nom}`);

        window.location.href = 'hours-entry.html';
    } catch (error) {
        console.error('Erreur de connexion:', error);
        errorMessage.textContent = 'Erreur lors de la connexion. Veuillez réessayer.';
        errorMessage.classList.add('show');
    }
});
