// Ward Case Management System for SevaNagar Health Dashboard

class WardCaseManager {
    constructor() {
        this.wardCases = [
            {
                ward: 'Ward-1',
                name: 'Central Business District',
                population: 50000,
                cases: {
                    'Dengue': { active: 45, new: 12, recovered: 120, deaths: 2 },
                    'Flu': { active: 8, new: 3, recovered: 45, deaths: 0 },
                    'COVID-19': { active: 5, new: 1, recovered: 30, deaths: 1 }
                },
                totalActive: 58,
                totalNew: 16,
                totalRecovered: 195,
                totalDeaths: 3,
                riskLevel: 'high',
                lastUpdate: new Date()
            },
            {
                ward: 'Ward-2',
                name: 'Residential North',
                population: 45000,
                cases: {
                    'Flu': { active: 32, new: 8, recovered: 80, deaths: 1 },
                    'Dengue': { active: 15, new: 4, recovered: 35, deaths: 0 },
                    'Malaria': { active: 3, new: 1, recovered: 12, deaths: 0 }
                },
                totalActive: 50,
                totalNew: 13,
                totalRecovered: 127,
                totalDeaths: 1,
                riskLevel: 'medium',
                lastUpdate: new Date()
            },
            {
                ward: 'Ward-3',
                name: 'Industrial Zone',
                population: 55000,
                cases: {
                    'Dengue': { active: 67, new: 15, recovered: 150, deaths: 3 },
                    'Flu': { active: 25, new: 6, recovered: 60, deaths: 1 },
                    'COVID-19': { active: 12, new: 3, recovered: 40, deaths: 2 }
                },
                totalActive: 104,
                totalNew: 24,
                totalRecovered: 250,
                totalDeaths: 6,
                riskLevel: 'critical',
                lastUpdate: new Date()
            },
            {
                ward: 'Ward-4',
                name: 'Suburban East',
                population: 40000,
                cases: {
                    'COVID-19': { active: 18, new: 3, recovered: 25, deaths: 0 },
                    'Flu': { active: 5, new: 1, recovered: 15, deaths: 0 },
                    'Dengue': { active: 2, new: 0, recovered: 8, deaths: 0 }
                },
                totalActive: 25,
                totalNew: 4,
                totalRecovered: 48,
                totalDeaths: 0,
                riskLevel: 'low',
                lastUpdate: new Date()
            },
            {
                ward: 'Ward-5',
                name: 'Rural South',
                population: 48000,
                cases: {
                    'Malaria': { active: 38, new: 6, recovered: 45, deaths: 1 },
                    'Dengue': { active: 12, new: 3, recovered: 25, deaths: 0 },
                    'Flu': { active: 8, new: 2, recovered: 20, deaths: 0 }
                },
                totalActive: 58,
                totalNew: 11,
                totalRecovered: 90,
                totalDeaths: 1,
                riskLevel: 'medium',
                lastUpdate: new Date()
            }
        ];

        this.initializeWardCaseManagement();
    }

    initializeWardCaseManagement() {
        this.updateWardCaseDisplay();
        this.setupEventListeners();
    }

    // Update ward case display
    updateWardCaseDisplay() {
        this.updateWardCaseTable();
        this.updateWardCaseCharts();
        this.updateWardCaseStats();
    }

    // Update ward case table
    updateWardCaseTable() {
        const tbody = document.getElementById('wardCaseTable');
        if (!tbody) return;

        tbody.innerHTML = '';
        this.wardCases.forEach(ward => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ward.ward}</td>
                <td>${ward.name}</td>
                <td>${ward.totalActive}</td>
                <td>${ward.totalNew}</td>
                <td>${ward.totalRecovered}</td>
                <td>${ward.totalDeaths}</td>
                <td><span class="badge bg-${this.getRiskColor(ward.riskLevel)}">${ward.riskLevel.toUpperCase()}</span></td>
                <td>${this.formatTime(ward.lastUpdate)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="openWardCaseUpdate('${ward.ward}')">
                        <i class="fas fa-edit"></i> Update
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Update ward case charts
    updateWardCaseCharts() {
        this.updateWardCaseChart();
        this.updateDiseaseBreakdownChart();
    }

    // Update ward case chart
    updateWardCaseChart() {
        const ctx = document.getElementById('wardCaseChart');
        if (!ctx) return;

        const wards = this.wardCases.map(w => w.ward);
        const activeCases = this.wardCases.map(w => w.totalActive);
        const newCases = this.wardCases.map(w => w.totalNew);
        const colors = this.wardCases.map(w => this.getRiskColor(w.riskLevel));

        if (window.wardCaseChart && typeof window.wardCaseChart.destroy === 'function') {
            window.wardCaseChart.destroy();
        }

        window.wardCaseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: wards,
                datasets: [
                    {
                        label: 'Active Cases',
                        data: activeCases,
                        backgroundColor: colors,
                        borderColor: colors.map(c => this.darkenColor(c)),
                        borderWidth: 2
                    },
                    {
                        label: 'New Cases',
                        data: newCases,
                        backgroundColor: colors.map(c => this.lightenColor(c)),
                        borderColor: colors,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                    x: { title: { display: true, text: 'Wards' } }
                },
                plugins: {
                    title: { display: true, text: 'Cases by Ward' },
                    legend: { position: 'top' }
                }
            }
        });
    }

    // Update disease breakdown chart
    updateDiseaseBreakdownChart() {
        const ctx = document.getElementById('diseaseBreakdownChart');
        if (!ctx) return;

        // Calculate total cases by disease
        const diseaseTotals = {};
        this.wardCases.forEach(ward => {
            Object.keys(ward.cases).forEach(disease => {
                if (!diseaseTotals[disease]) {
                    diseaseTotals[disease] = 0;
                }
                diseaseTotals[disease] += ward.cases[disease].active;
            });
        });

        const diseases = Object.keys(diseaseTotals);
        const totals = Object.values(diseaseTotals);
        const colors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'];

        if (window.diseaseBreakdownChart && typeof window.diseaseBreakdownChart.destroy === 'function') {
            window.diseaseBreakdownChart.destroy();
        }

        window.diseaseBreakdownChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: diseases,
                datasets: [{
                    data: totals,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: 'Disease Breakdown' },
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Update ward case statistics
    updateWardCaseStats() {
        const totalActive = this.wardCases.reduce((sum, w) => sum + w.totalActive, 0);
        const totalNew = this.wardCases.reduce((sum, w) => sum + w.totalNew, 0);
        const totalRecovered = this.wardCases.reduce((sum, w) => sum + w.totalRecovered, 0);
        const totalDeaths = this.wardCases.reduce((sum, w) => sum + w.totalDeaths, 0);
        const criticalWards = this.wardCases.filter(w => w.riskLevel === 'critical').length;

        // Update stats display
        const statsElements = {
            'totalWardCases': totalActive,
            'newWardCases': totalNew,
            'recoveredWardCases': totalRecovered,
            'deathsWardCases': totalDeaths,
            'criticalWardCount': criticalWards
        };

        Object.keys(statsElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = statsElements[id];
            }
        });
    }

    // Get risk color
    getRiskColor(riskLevel) {
        const colors = {
            'critical': 'danger',
            'high': 'warning',
            'medium': 'info',
            'low': 'success'
        };
        return colors[riskLevel] || 'secondary';
    }

    // Darken color
    darkenColor(color) {
        return color.replace('rgb(', 'rgba(').replace(')', ', 0.8)');
    }

    // Lighten color
    lightenColor(color) {
        return color.replace('rgb(', 'rgba(').replace(')', ', 0.4)');
    }

    // Setup event listeners
    setupEventListeners() {
        // Ward case update form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'wardCaseUpdateForm') {
                e.preventDefault();
                this.updateWardCaseData(e);
            }
        });
    }

    // Update ward case data
    updateWardCaseData(event) {
        const formData = new FormData(event.target);
        const ward = formData.get('ward');
        const disease = formData.get('disease');
        const active = parseInt(formData.get('active'));
        const newCases = parseInt(formData.get('newCases'));
        const recovered = parseInt(formData.get('recovered'));
        const deaths = parseInt(formData.get('deaths'));

        const wardData = this.wardCases.find(w => w.ward === ward);
        if (wardData) {
            // Update disease data
            wardData.cases[disease] = {
                active: active,
                new: newCases,
                recovered: recovered,
                deaths: deaths
            };

            // Recalculate totals
            wardData.totalActive = Object.values(wardData.cases).reduce((sum, d) => sum + d.active, 0);
            wardData.totalNew = Object.values(wardData.cases).reduce((sum, d) => sum + d.new, 0);
            wardData.totalRecovered = Object.values(wardData.cases).reduce((sum, d) => sum + d.recovered, 0);
            wardData.totalDeaths = Object.values(wardData.cases).reduce((sum, d) => sum + d.deaths, 0);
            wardData.riskLevel = this.calculateRiskLevel(wardData.totalActive);
            wardData.lastUpdate = new Date();

            this.updateWardCaseDisplay();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('wardCaseUpdateModal'));
            modal.hide();
            
            showNotification('success', `Ward case data updated for ${ward} - ${disease}`);
        }
    }

    // Calculate risk level based on active cases
    calculateRiskLevel(activeCases) {
        if (activeCases >= 80) return 'critical';
        if (activeCases >= 50) return 'high';
        if (activeCases >= 20) return 'medium';
        return 'low';
    }

    // Get ward data by ward name
    getWardData(ward) {
        return this.wardCases.find(w => w.ward === ward);
    }

    // Get all ward cases
    getWardCases() {
        return this.wardCases;
    }

    // Format time
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

// Global ward case manager instance
window.wardCaseManager = new WardCaseManager();

// Function to open ward case update modal
window.openWardCaseUpdate = function(ward) {
    const wardData = window.wardCaseManager.getWardData(ward);
    if (!wardData) return;

    // Populate form
    document.getElementById('wardCaseUpdateWard').value = wardData.ward;
    document.getElementById('wardCaseUpdateName').textContent = wardData.name;
    document.getElementById('wardCaseUpdateDisease').innerHTML = '';
    
    // Add disease options
    Object.keys(wardData.cases).forEach(disease => {
        const option = document.createElement('option');
        option.value = disease;
        option.textContent = disease;
        document.getElementById('wardCaseUpdateDisease').appendChild(option);
    });

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('wardCaseUpdateModal'));
    modal.show();
};

// Function to show notification
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}