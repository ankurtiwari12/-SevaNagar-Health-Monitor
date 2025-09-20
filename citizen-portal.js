// Enhanced Citizen Portal for SevaNagar Health Dashboard

class CitizenPortal {
    constructor() {
        this.alerts = [
            {
                id: 1,
                type: 'warning',
                title: 'Dengue Alert - Ward 3',
                message: 'High dengue cases detected in Ward-3. Use mosquito repellent and clear standing water.',
                ward: 'Ward-3',
                severity: 'high',
                date: new Date('2024-01-20'),
                isActive: true
            },
            {
                id: 2,
                type: 'info',
                title: 'Vaccination Drive',
                message: 'Free flu vaccination available at all government hospitals this week.',
                ward: 'All Wards',
                severity: 'medium',
                date: new Date('2024-01-18'),
                isActive: true
            },
            {
                id: 3,
                type: 'success',
                title: 'Health Advisory',
                message: 'Ward-1 vaccination target achieved. Great job residents!',
                ward: 'Ward-1',
                severity: 'low',
                date: new Date('2024-01-15'),
                isActive: true
            }
        ];

        this.preventionTips = [
            {
                id: 1,
                category: 'Mosquito Prevention',
                title: 'Prevent Dengue & Malaria',
                tips: [
                    'Empty containers with standing water weekly',
                    'Use mosquito nets while sleeping',
                    'Apply mosquito repellent when outdoors',
                    'Wear long-sleeved clothing in the evening'
                ],
                priority: 'high'
            },
            {
                id: 2,
                category: 'Hand Hygiene',
                title: 'Prevent Disease Spread',
                tips: [
                    'Wash hands with soap for 20 seconds',
                    'Use hand sanitizer when soap unavailable',
                    'Avoid touching face with unwashed hands',
                    'Cover coughs and sneezes with tissue'
                ],
                priority: 'high'
            },
            {
                id: 3,
                category: 'Social Distancing',
                title: 'Reduce Contact Risk',
                tips: [
                    'Maintain 6 feet distance in crowded areas',
                    'Avoid large gatherings when possible',
                    'Wear masks in enclosed spaces',
                    'Stay home if feeling unwell'
                ],
                priority: 'medium'
            },
            {
                id: 4,
                category: 'Vaccination',
                title: 'Stay Protected',
                tips: [
                    'Get vaccinated as per schedule',
                    'Keep vaccination records updated',
                    'Check for booster shots needed',
                    'Consult doctor for vaccine questions'
                ],
                priority: 'high'
            }
        ];

        this.healthStats = {
            totalCases: 0,
            activeAlerts: 0,
            vaccinationRate: 0,
            hospitalBeds: 0
        };

        this.initializeCitizenPortal();
    }

    initializeCitizenPortal() {
        this.updateHealthStats();
        this.updateAlerts();
        this.updatePreventionTips();
        this.setupEventListeners();
    }

    // Update health statistics
    updateHealthStats() {
        // Get data from other managers if available
        if (window.hospitalManager) {
            const hospitals = window.hospitalManager.getHospitals();
            this.healthStats.hospitalBeds = hospitals.reduce((sum, h) => sum + h.availableBeds, 0);
        }

        if (window.vaccinationManager) {
            const vaccinationData = window.vaccinationManager.getVaccinationData();
            const totalPopulation = vaccinationData.reduce((sum, v) => sum + v.totalPopulation, 0);
            const totalVaccinated = vaccinationData.reduce((sum, v) => sum + v.vaccinated, 0);
            this.healthStats.vaccinationRate = ((totalVaccinated / totalPopulation) * 100).toFixed(1);
        }

        this.healthStats.activeAlerts = this.alerts.filter(a => a.isActive).length;

        this.displayHealthStats();
    }

    // Display health statistics
    displayHealthStats() {
        const statsContainer = document.getElementById('citizenHealthStats');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="row text-center">
                <div class="col-6 col-md-3">
                    <div class="citizen-stat">
                        <div class="stat-value">${this.healthStats.totalCases}</div>
                        <div class="stat-label">Active Cases</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="citizen-stat">
                        <div class="stat-value">${this.healthStats.hospitalBeds}</div>
                        <div class="stat-label">Available Beds</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="citizen-stat">
                        <div class="stat-value">${this.healthStats.vaccinationRate}%</div>
                        <div class="stat-label">Vaccination Rate</div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="citizen-stat">
                        <div class="stat-value">${this.healthStats.activeAlerts}</div>
                        <div class="stat-label">Active Alerts</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Update alerts display
    updateAlerts() {
        const alertsContainer = document.getElementById('citizenAlertsSection');
        if (!alertsContainer) return;

        const activeAlerts = this.alerts.filter(a => a.isActive);
        alertsContainer.innerHTML = '';

        if (activeAlerts.length === 0) {
            alertsContainer.innerHTML = '<div class="text-center text-muted">No active alerts</div>';
            return;
        }

        activeAlerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = `citizen-alert mb-3 alert-${alert.type}`;
            alertDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">
                            <i class="fas fa-${this.getAlertIcon(alert.type)} me-2"></i>
                            ${alert.title}
                        </h6>
                        <p class="mb-1">${alert.message}</p>
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt me-1"></i>${alert.ward} • 
                            <i class="fas fa-calendar me-1"></i>${alert.date.toLocaleDateString()}
                        </small>
                    </div>
                    <div class="ms-2">
                        <span class="badge bg-${this.getSeverityColor(alert.severity)}">${alert.severity.toUpperCase()}</span>
                    </div>
                </div>
            `;
            alertsContainer.appendChild(alertDiv);
        });
    }

    // Update prevention tips
    updatePreventionTips() {
        const tipsContainer = document.getElementById('preventionTipsSection');
        if (!tipsContainer) return;

        tipsContainer.innerHTML = '';

        this.preventionTips.forEach(tip => {
            const tipDiv = document.createElement('div');
            tipDiv.className = `prevention-tip mb-3 priority-${tip.priority}`;
            tipDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-2">
                            <i class="fas fa-${this.getCategoryIcon(tip.category)} me-2"></i>
                            ${tip.title}
                        </h6>
                        <ul class="mb-2">
                            ${tip.tips.map(t => `<li><small>${t}</small></li>`).join('')}
                        </ul>
                        <small class="text-muted">
                            <i class="fas fa-tag me-1"></i>${tip.category}
                        </small>
                    </div>
                    <div class="ms-2">
                        <span class="badge bg-${this.getPriorityColor(tip.priority)}">${tip.priority.toUpperCase()}</span>
                    </div>
                </div>
            `;
            tipsContainer.appendChild(tipDiv);
        });
    }

    // Get alert icon
    getAlertIcon(type) {
        const icons = {
            'warning': 'exclamation-triangle',
            'info': 'info-circle',
            'success': 'check-circle',
            'error': 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Get severity color
    getSeverityColor(severity) {
        const colors = {
            'high': 'danger',
            'medium': 'warning',
            'low': 'success'
        };
        return colors[severity] || 'secondary';
    }

    // Get category icon
    getCategoryIcon(category) {
        const icons = {
            'Mosquito Prevention': 'bug',
            'Hand Hygiene': 'hand-paper',
            'Social Distancing': 'users',
            'Vaccination': 'syringe'
        };
        return icons[category] || 'shield-alt';
    }

    // Get priority color
    getPriorityColor(priority) {
        const colors = {
            'high': 'danger',
            'medium': 'warning',
            'low': 'success'
        };
        return colors[priority] || 'secondary';
    }

    // Setup event listeners
    setupEventListeners() {
        // Alert submission form
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'citizenAlertForm') {
                e.preventDefault();
                this.submitCitizenAlert(e);
            }
        });

        // Health query form
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'healthQueryForm') {
                e.preventDefault();
                this.submitHealthQuery(e);
            }
        });
    }

    // Submit citizen alert
    submitCitizenAlert(event) {
        const formData = new FormData(event.target);
        const type = formData.get('alertType');
        const title = formData.get('alertTitle');
        const message = formData.get('alertMessage');
        const ward = formData.get('alertWard');

        const newAlert = {
            id: this.alerts.length + 1,
            type: type,
            title: title,
            message: message,
            ward: ward,
            severity: 'medium',
            date: new Date(),
            isActive: true
        };

        this.alerts.unshift(newAlert);
        this.updateAlerts();
        this.updateHealthStats();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('citizenAlertModal'));
        modal.hide();

        // Reset form
        event.target.reset();

        showNotification('success', 'Your alert has been submitted successfully');
    }

    // Submit health query
    submitHealthQuery(event) {
        const formData = new FormData(event.target);
        const query = formData.get('healthQuery');
        const contact = formData.get('contactInfo');

        // In a real application, this would be sent to a backend
        console.log('Health Query:', { query, contact });

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('healthQueryModal'));
        modal.hide();

        // Reset form
        event.target.reset();

        showNotification('success', 'Your health query has been submitted. We will contact you soon.');
    }

    // Add new alert (for admin use)
    addAlert(alert) {
        this.alerts.unshift(alert);
        this.updateAlerts();
        this.updateHealthStats();
    }

    // Get all alerts
    getAlerts() {
        return this.alerts;
    }

    // Get prevention tips
    getPreventionTips() {
        return this.preventionTips;
    }
}

// Global citizen portal instance
window.citizenPortal = new CitizenPortal();

// Function to open citizen alert modal
window.openCitizenAlert = function() {
    const modal = new bootstrap.Modal(document.getElementById('citizenAlertModal'));
    modal.show();
};

// Function to open health query modal
window.openHealthQuery = function() {
    const modal = new bootstrap.Modal(document.getElementById('healthQueryModal'));
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