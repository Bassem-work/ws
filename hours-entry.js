const employeeId = sessionStorage.getItem('employeeId');
const employeeName = sessionStorage.getItem('employeeName');

if (!employeeId) {
    window.location.href = 'index.html';
}

document.getElementById('userName').textContent = employeeName;

const today = new Date().toISOString().split('T')[0];
document.getElementById('workDate').value = today;

const currentMonth = new Date().toISOString().slice(0, 7);
document.getElementById('monthSelect').value = currentMonth;

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

document.getElementById('hoursForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const workDate = document.getElementById('workDate').value;
    const hours = parseFloat(document.getElementById('hours').value);
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');

    try {
        const { data: existing } = await window.supabaseClient
            .from('work_hours')
            .select('id')
            .eq('employee_id', employeeId)
            .eq('date', workDate)
            .maybeSingle();

        if (existing) {
            const { error } = await window.supabaseClient
                .from('work_hours')
                .update({ hours })
                .eq('id', existing.id);

            if (error) throw error;
        } else {
            const { error } = await window.supabaseClient
                .from('work_hours')
                .insert([
                    { employee_id: employeeId, date: workDate, hours }
                ]);

            if (error) throw error;
        }

        successMessage.textContent = 'Heures enregistrées avec succès!';
        successMessage.classList.add('show');

        document.getElementById('hours').value = '';

        loadMonthHours();
    } catch (error) {
        console.error('Erreur:', error);
        errorMessage.textContent = 'Erreur lors de l\'enregistrement. Veuillez réessayer.';
        errorMessage.classList.add('show');
    }
});

async function loadMonthHours() {
    const monthSelect = document.getElementById('monthSelect').value;
    const [year, month] = monthSelect.split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    try {
        const { data, error } = await window.supabaseClient
            .from('work_hours')
            .select('*')
            .eq('employee_id', employeeId)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: true });

        if (error) throw error;

        displayHoursTable(data);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function displayHoursTable(data) {
    const hoursTable = document.getElementById('hoursTable');

    if (!data || data.length === 0) {
        hoursTable.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Aucune heure enregistrée pour ce mois.</p>';
        return;
    }

    let html = '<table><thead><tr><th>Date</th><th>Jour</th><th>Heures</th><th>Actions</th></tr></thead><tbody>';

    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    data.forEach(entry => {
        const date = new Date(entry.date);
        const dayName = daysOfWeek[date.getDay()];
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        html += `<tr ${isWeekend ? 'class="weekend"' : ''}>
            <td>${new Date(entry.date).toLocaleDateString('fr-FR')}</td>
            <td class="day-name">${dayName}</td>
            <td>${entry.hours}h</td>
            <td class="actions">
                <button class="btn btn-small btn-danger" onclick="deleteEntry('${entry.id}')">Supprimer</button>
            </td>
        </tr>`;
    });

    html += '</tbody></table>';
    hoursTable.innerHTML = html;
}

async function deleteEntry(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée?')) {
        return;
    }

    try {
        const { error } = await window.supabaseClient
            .from('work_hours')
            .delete()
            .eq('id', id);

        if (error) throw error;

        loadMonthHours();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
    }
}

loadMonthHours();
