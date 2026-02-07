const employeeId = sessionStorage.getItem('employeeId');
const employeeName = sessionStorage.getItem('employeeName');

if (!employeeId) {
    window.location.href = 'index.html';
}

document.getElementById('userName').textContent = employeeName;

const currentMonth = new Date().toISOString().slice(0, 7);
document.getElementById('monthSelect').value = currentMonth;

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

async function calculateSummary() {
    const monthSelect = document.getElementById('monthSelect').value;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);

    if (!monthSelect) {
        alert('Veuillez sélectionner un mois');
        return;
    }

    if (!hourlyRate || hourlyRate <= 0) {
        alert('Veuillez entrer un prix de l\'heure valide');
        return;
    }

    const [year, month] = monthSelect.split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    try {
        const { data, error } = await supabase
            .from('work_hours')
            .select('*')
            .eq('employee_id', employeeId)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            alert('Aucune heure enregistrée pour ce mois');
            return;
        }

        const calculations = calculateHours(data, hourlyRate);
        displaySummary(calculations, data);
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du calcul');
    }
}

function calculateHours(data, hourlyRate) {
    let normalHours = 0;
    let overtimeHours125 = 0;
    let overtimeHours200 = 0;

    const details = [];

    data.forEach(entry => {
        const date = new Date(entry.date);
        const dayOfWeek = date.getDay();
        const hours = parseFloat(entry.hours);

        let normal = 0;
        let overtime125 = 0;
        let overtime200 = 0;

        if (dayOfWeek === 0) {
            overtime200 = hours;
        } else if (dayOfWeek === 6) {
            overtime125 = hours;
        } else {
            if (hours <= 8) {
                normal = hours;
            } else {
                normal = 8;
                overtime125 = hours - 8;
            }
        }

        normalHours += normal;
        overtimeHours125 += overtime125;
        overtimeHours200 += overtime200;

        details.push({
            date: entry.date,
            dayOfWeek,
            hours,
            normal,
            overtime125,
            overtime200
        });
    });

    const normalPay = normalHours * hourlyRate;
    const overtime125Pay = overtimeHours125 * hourlyRate * 1.25;
    const overtime200Pay = overtimeHours200 * hourlyRate * 2.0;
    const totalPay = normalPay + overtime125Pay + overtime200Pay;

    return {
        normalHours,
        overtimeHours125,
        overtimeHours200,
        normalPay,
        overtime125Pay,
        overtime200Pay,
        totalPay,
        hourlyRate,
        details
    };
}

function displaySummary(calculations, data) {
    const summaryResults = document.getElementById('summaryResults');
    const detailedTable = document.getElementById('detailedTable');

    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    let summaryHTML = `
        <div class="summary-grid">
            <div class="summary-card">
                <h3>Heures Normales</h3>
                <div class="value">${calculations.normalHours.toFixed(2)}h</div>
                <p>${calculations.normalPay.toFixed(2)}€</p>
            </div>
            <div class="summary-card">
                <h3>Heures Supp x1.25</h3>
                <div class="value">${calculations.overtimeHours125.toFixed(2)}h</div>
                <p>${calculations.overtime125Pay.toFixed(2)}€</p>
            </div>
            <div class="summary-card">
                <h3>Heures Supp x2.0</h3>
                <div class="value">${calculations.overtimeHours200.toFixed(2)}h</div>
                <p>${calculations.overtime200Pay.toFixed(2)}€</p>
            </div>
            <div class="summary-card total-card">
                <h3>Total à Payer</h3>
                <div class="value">${calculations.totalPay.toFixed(2)}€</div>
                <p>Taux horaire: ${calculations.hourlyRate.toFixed(2)}€</p>
            </div>
        </div>
    `;

    summaryResults.innerHTML = summaryHTML;
    summaryResults.classList.add('show');

    let tableHTML = `
        <h2 style="margin-top: 30px; margin-bottom: 15px;">Détails par Jour</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Jour</th>
                    <th>Heures Totales</th>
                    <th>Heures Normales</th>
                    <th>Heures Supp x1.25</th>
                    <th>Heures Supp x2.0</th>
                    <th>Total Jour</th>
                </tr>
            </thead>
            <tbody>
    `;

    calculations.details.forEach(detail => {
        const dayName = daysOfWeek[detail.dayOfWeek];
        const isWeekend = detail.dayOfWeek === 0 || detail.dayOfWeek === 6;

        const dayPay = (detail.normal * calculations.hourlyRate) +
                       (detail.overtime125 * calculations.hourlyRate * 1.25) +
                       (detail.overtime200 * calculations.hourlyRate * 2.0);

        tableHTML += `
            <tr ${isWeekend ? 'class="weekend"' : ''}>
                <td>${new Date(detail.date).toLocaleDateString('fr-FR')}</td>
                <td class="day-name">${dayName}</td>
                <td><strong>${detail.hours.toFixed(2)}h</strong></td>
                <td>${detail.normal.toFixed(2)}h</td>
                <td>${detail.overtime125.toFixed(2)}h</td>
                <td>${detail.overtime200.toFixed(2)}h</td>
                <td><strong>${dayPay.toFixed(2)}€</strong></td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    detailedTable.innerHTML = tableHTML;
}
