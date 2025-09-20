// Vaccination Coverage Tracking System for SevaNagar Health Dashboard

class VaccinationManager {
    constructor() {
        this.vaccinationData = [
            {
                ward: 'Ward-1',
                name: 'Central Business District',
                totalPopulation: 50000,
                vaccinated: 42500,
                vaccinationRate: 85.0,
                targetPopulation: 45000,
                remainingTarget: 2500,
                lastCampaign: '2024-01-15',
                nextCampaign: '2024-02-15',
                status: 'on-track',
                priority: 'medium'
            },
            {
                ward: 'Ward-2',
                name: 'Residential North',
                totalPopulation: 45000,
                vaccinated: 32400,
                vaccinationRate: 72.0,
                targetPopulation: 40000,
                remainingTarget: 7600,
                lastCampaign: '2024-01-10',
                nextCampaign: '2024-01-25',
                status: 'behind',
                priority: 'high'
            },
            {
                ward: 'Ward-3',
                name: 'Industrial Zone',
                totalPopulation: 55000,
                vaccinated: 50050,
                vaccinationRate: 91.0,
                targetPopulation: 50000,
                remainingTarget: 0,
                lastCampaign: '2024-01-20',
                nextCampaign: '2024-03-01',
                status: 'completed',
                priority: 'low'
            },
            {
                ward: 'Ward-4',
                name: 'Suburban East',
                totalPopulation: 40000,
                vaccinated: 27200,
                vaccinationRate: 68.0,
                targetPopulation: 36000,
                remainingTarget: 8800,
                lastCampaign: '2024-01-05',
                nextCampaign: '2024-01-20',
                status: 'critical',
                priority: 'urgent'
            },
            {
                ward: 'Ward-5',
                name: 'Rural South',
                totalPopulation: 48000,
                vaccinated: 37440,
                vaccinationRate: 78.0,
                targetPopulation: 43200,
                remainingTarget: 5760,
                lastCampaign: '2024-01-12',
                nextCampaign: '2024-02-01',
                status: 'behind',
                priority: 'high'
            }
        ];

        this.initializeVaccinationTracking();
    }

    initializeVaccinationTracking() {
        this.updateVaccinationCharts();
        this.updateVaccinationList();
        this.setupEventListeners();
    }

    // Update vaccination charts
    updateVaccinationCharts() {
        this.updateVaccinationCoverageChart();
        this.updateVaccinationProgressChart();
    }

    // Update vaccination coverage chart
    updateVaccinationCoverageChart() {
        const ctx = document.getElementById('vaccinationCoverageChart');
        if (!ctx) return;

        const wards = this.vaccinationData.map(v => v.ward);
        const rates = this.vaccinationData.map(v => v.vaccinationRate);
        const colors = this.vaccinationData.map(v => this.getPriorityColor(v.priority));

        if (window.vaccinationCoverageChart && typeof window.vaccinationCoverageChart.destroy === 'function') {
            window.vaccinationCoverageChart.destroy();
        }

        window.vaccinationCoverageChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: wards,
                datasets: [{
                    label: 'Vaccination Rate (%)',
                    data: rates,
                    backgroundColor: colors,
                    borderColor: colors.map(c => this.darkenColor(c)),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { 
                        beginAtZero: true, 
                        max: 100,
                        title: {
                            display: true,
                            text: 'Vaccination Rate (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Wards'
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Vaccination Coverage by Ward'
                    }
                }
            }
        });
    }

    // Update vaccination progress chart
    updateVaccinationProgressChart() {
        const ctx = document.getElementById('vaccinationProgressChart');
        if (!ctx) return;

        const totalTarget = this.vaccinationData.reduce((sum, v) => sum + v.targetPopulation, 0);
        const totalVaccinated = this.vaccinationData.reduce((sum, v) => sum + v.vaccinated, 0);
        const remaining = totalTarget - totalVaccinated;

        if (window.vaccinationProgressChart && typeof window.vaccinationProgressChart.destroy === 'function') {
            window.vaccinationProgressChart.destroy();
        }

        window.vaccinationProgressChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Vaccinated', 'Remaining Target'],
                datasets: [{
                    data: [totalVaccinated, remaining],
                    backgroundColor: ['#28a745', '#ffc107'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: 'Overall Vaccination Progress'
                    }
                }
            }
        });
    }

    // Update vaccination list
    updateVaccinationList() {
        const vaccinationList = document.getElementById('vaccinationList');
        if (!vaccinationList) return;

        vaccinationList.innerHTML = '';
        this.vaccinationData.forEach(ward => {
            const wardDiv = document.createElement('div');
            wardDiv.className = 'vaccination-item mb-3 p-3 border rounded';
            wardDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${ward.ward} - ${ward.name}</h6>
                        <div class="row mt-2">
                            <div class="col-md-6">
                                <small><strong>Population:</strong> ${ward.totalPopulation.toLocaleString()}</small><br>
                                <small><strong>Vaccinated:</strong> ${ward.vaccinated.toLocaleString()}</small><br>
                                <small><strong>Rate:</strong> ${ward.vaccinationRate}%</small>
                            </div>
                            <div class="col-md-6">
                                <small><strong>Target:</strong> ${ward.targetPopulation.toLocaleString()}</small><br>
                                <small><strong>Remaining:</strong> ${ward.remainingTarget.toLocaleString()}</small><br>
                                <small><strong>Status:</strong> <span class="badge bg-${this.getStatusColor(ward.status)}">${ward.status.toUpperCase()}</span></small>
                            </div>
                        </div>
                        <div class="mt-2">
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-${this.getStatusColor(ward.status)}" 
                                     style="width: ${ward.vaccinationRate}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="ms-3">
                        <button class="btn btn-sm btn-outline-primary" onclick="openVaccinationUpdate('${ward.ward}')">
                            <i class="fas fa-edit"></i> Update
                        </button>
                    </div>
                </div>
            `;
            vaccinationList.appendChild(wardDiv);
        });
    }

    // Get priority color
    getPriorityColor(priority) {
        const colors = {
            'urgent': '#dc3545',
            'high': '#fd7e14',
            'medium': '#ffc107',
            'low': '#28a745'
        };
        return colors[priority] || '#6c757d';
    }

    // Get status color
    getStatusColor(status) {
        const colors = {
            'completed': 'success',
            'on-track': 'info',
            'behind': 'warning',
            'critical': 'danger'
        };
        return colors[status] || 'secondary';
    }

    // Darken color for borders
    darkenColor(color) {
        // Simple color darkening - in a real app, you'd use a proper color library
        return color.replace('rgb(', 'rgba(').replace(')', ', 0.8)');
    }

    // Setup event listeners
    setupEventListeners() {
        // Vaccination update form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'vaccinationUpdateForm') {
                e.preventDefault();
                this.updateVaccinationData(e);
            }
        });
    }

    // Update vaccination data
    updateVaccinationData(event) {
        const formData = new FormData(event.target);
        const ward = formData.get('ward');
        const vaccinated = parseInt(formData.get('vaccinated'));
        const newVaccinations = parseInt(formData.get('newVaccinations'));

        const wardData = this.vaccinationData.find(v => v.ward === ward);
        if (wardData) {
            wardData.vaccinated = vaccinated;
            wardData.vaccinationRate = ((vaccinated / wardData.totalPopulation) * 100).toFixed(1);
            wardData.remainingTarget = Math.max(0, wardData.targetPopulation - vaccinated);
            wardData.status = this.calculateStatus(wardData.vaccinationRate);
            wardData.priority = this.calculatePriority(wardData.vaccinationRate);

            this.updateVaccinationCharts();
            this.updateVaccinationList();
            this.updateVaccinationStats();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('vaccinationUpdateModal'));
            modal.hide();
            
            showNotification('success', `Vaccination data updated for ${ward}`);
        }
    }

    // Calculate status based on vaccination rate
    calculateStatus(rate) {
        if (rate >= 90) return 'completed';
        if (rate >= 80) return 'on-track';
        if (rate >= 60) return 'behind';
        return 'critical';
    }

    // Calculate priority based on vaccination rate
    calculatePriority(rate) {
        if (rate < 60) return 'urgent';
        if (rate < 70) return 'high';
        if (rate < 80) return 'medium';
        return 'low';
    }

    // Update vaccination statistics
    updateVaccinationStats() {
        const totalPopulation = this.vaccinationData.reduce((sum, v) => sum + v.totalPopulation, 0);
        const totalVaccinated = this.vaccinationData.reduce((sum, v) => sum + v.vaccinated, 0);
        const avgRate = ((totalVaccinated / totalPopulation) * 100).toFixed(1);
        const targetWards = this.vaccinationData.filter(v => v.status === 'behind' || v.status === 'critical').length;
        const completedWards = this.vaccinationData.filter(v => v.status === 'completed').length;

        // Update stats display
        const avgCoverageElement = document.getElementById('avgCoverage');
        const targetWardsElement = document.getElementById('targetWards');
        const completedWardsElement = document.getElementById('completedWards');

        if (avgCoverageElement) avgCoverageElement.textContent = avgRate + '%';
        if (targetWardsElement) targetWardsElement.textContent = targetWards;
        if (completedWardsElement) completedWardsElement.textContent = completedWards;
    }

    // Get ward data by ward name
    getWardData(ward) {
        return this.vaccinationData.find(v => v.ward === ward);
    }

    // Get all vaccination data
    getVaccinationData() {
        return this.vaccinationData;
    }
}

// Global vaccination manager instance
window.vaccinationManager = new VaccinationManager();

// Function to open vaccination update modal
window.openVaccinationUpdate = function(ward) {
    const wardData = window.vaccinationManager.getWardData(ward);
    if (!wardData) return;

    // Populate form
    document.getElementById('vaccinationUpdateWard').value = wardData.ward;
    document.getElementById('vaccinationUpdateName').textContent = wardData.name;
    document.getElementById('vaccinationUpdatePopulation').textContent = wardData.totalPopulation.toLocaleString();
    document.getElementById('vaccinationUpdateVaccinated').value = wardData.vaccinated;
    document.getElementById('vaccinationUpdateRate').textContent = wardData.vaccinationRate + '%';
    document.getElementById('vaccinationUpdateRemaining').textContent = wardData.remainingTarget.toLocaleString();

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('vaccinationUpdateModal'));
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