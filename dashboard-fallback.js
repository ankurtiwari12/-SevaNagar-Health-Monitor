// Fallback Dashboard for SevaNagar Health Dashboard (Works without backend)

class SevaNagarHealthDashboardFallback {
    constructor() {
        this.map = null;
        this.charts = {};
        this.data = {
            cases: [],
            hospitals: [],
            vaccinations: [],
            alerts: [],
            stats: {}
        };
        
        this.init();
    }

    async init() {
        console.log('Initializing SevaNagar Health Dashboard (Fallback Mode)...');
        
        // Load sample data
        this.loadSampleData();
        
        // Initialize components
        this.initializeMap();
        this.initializeCharts();
        this.setupEventListeners();
        
        // Start real-time updates
        this.startRealTimeUpdates();
        
        console.log('Dashboard initialized successfully (Fallback Mode)');
    }

    // Load sample data
    loadSampleData() {
        // Sample case data
        this.data.cases = [
            { ward: 'Ward-1', disease: 'Dengue', newCases: 12, totalCases: 45, status: 'high', lastUpdated: new Date() },
            { ward: 'Ward-2', disease: 'Flu', newCases: 8, totalCases: 32, status: 'medium', lastUpdated: new Date() },
            { ward: 'Ward-3', disease: 'Dengue', newCases: 15, totalCases: 67, status: 'critical', lastUpdated: new Date() },
            { ward: 'Ward-4', disease: 'COVID-19', newCases: 3, totalCases: 18, status: 'low', lastUpdated: new Date() },
            { ward: 'Ward-5', disease: 'Malaria', newCases: 6, totalCases: 38, status: 'medium', lastUpdated: new Date() }
        ];

        // Sample hospital data with medicine stock
        this.data.hospitals = [
            { 
                name: 'SevaNagar General Hospital', 
                ward: 'Ward-1', 
                totalBeds: 100, 
                occupiedBeds: 65, 
                availableBeds: 35, 
                icuBeds: 20, 
                ventilators: 15,
                medicines: [
                    { name: 'Paracetamol', stock: 1500, required: 2000, status: 'low' },
                    { name: 'Ibuprofen', stock: 800, required: 1000, status: 'medium' },
                    { name: 'Antibiotics', stock: 300, required: 500, status: 'low' },
                    { name: 'Insulin', stock: 200, required: 300, status: 'medium' },
                    { name: 'Vaccines', stock: 450, required: 600, status: 'medium' }
                ]
            },
            { 
                name: 'City Medical Center', 
                ward: 'Ward-2', 
                totalBeds: 80, 
                occupiedBeds: 45, 
                availableBeds: 35, 
                icuBeds: 15, 
                ventilators: 12,
                medicines: [
                    { name: 'Paracetamol', stock: 1200, required: 1500, status: 'medium' },
                    { name: 'Ibuprofen', stock: 600, required: 800, status: 'medium' },
                    { name: 'Antibiotics', stock: 400, required: 400, status: 'good' },
                    { name: 'Insulin', stock: 150, required: 200, status: 'medium' },
                    { name: 'Vaccines', stock: 350, required: 500, status: 'low' }
                ]
            },
            { 
                name: 'Emergency Care Hospital', 
                ward: 'Ward-3', 
                totalBeds: 120, 
                occupiedBeds: 90, 
                availableBeds: 30, 
                icuBeds: 25, 
                ventilators: 20,
                medicines: [
                    { name: 'Paracetamol', stock: 800, required: 2000, status: 'critical' },
                    { name: 'Ibuprofen', stock: 400, required: 1200, status: 'low' },
                    { name: 'Antibiotics', stock: 200, required: 800, status: 'critical' },
                    { name: 'Insulin', stock: 100, required: 400, status: 'critical' },
                    { name: 'Vaccines', stock: 200, required: 600, status: 'critical' }
                ]
            },
            { 
                name: 'Community Health Center', 
                ward: 'Ward-4', 
                totalBeds: 60, 
                occupiedBeds: 30, 
                availableBeds: 30, 
                icuBeds: 10, 
                ventilators: 8,
                medicines: [
                    { name: 'Paracetamol', stock: 1000, required: 1000, status: 'good' },
                    { name: 'Ibuprofen', stock: 700, required: 700, status: 'good' },
                    { name: 'Antibiotics', stock: 350, required: 350, status: 'good' },
                    { name: 'Insulin', stock: 180, required: 180, status: 'good' },
                    { name: 'Vaccines', stock: 400, required: 400, status: 'good' }
                ]
            },
            { 
                name: 'Rural Medical Center', 
                ward: 'Ward-5', 
                totalBeds: 70, 
                occupiedBeds: 40, 
                availableBeds: 30, 
                icuBeds: 12, 
                ventilators: 10,
                medicines: [
                    { name: 'Paracetamol', stock: 900, required: 1200, status: 'medium' },
                    { name: 'Ibuprofen', stock: 500, required: 600, status: 'medium' },
                    { name: 'Antibiotics', stock: 250, required: 400, status: 'low' },
                    { name: 'Insulin', stock: 120, required: 200, status: 'low' },
                    { name: 'Vaccines', stock: 300, required: 450, status: 'medium' }
                ]
            }
        ];

        // Sample vaccination data
        this.data.vaccinations = [
            { ward: 'Ward-1', totalPopulation: 50000, vaccinated: 42500, vaccinationRate: 85.0 },
            { ward: 'Ward-2', totalPopulation: 45000, vaccinated: 32400, vaccinationRate: 72.0 },
            { ward: 'Ward-3', totalPopulation: 55000, vaccinated: 50050, vaccinationRate: 91.0 },
            { ward: 'Ward-4', totalPopulation: 40000, vaccinated: 27200, vaccinationRate: 68.0 },
            { ward: 'Ward-5', totalPopulation: 48000, vaccinated: 37440, vaccinationRate: 78.0 }
        ];

        // Sample alert data
        this.data.alerts = [
            { type: 'warning', message: 'Dengue outbreak detected in Ward-3', ward: 'Ward-3', severity: 'high' },
            { type: 'info', message: 'Vaccination drive scheduled for Ward-4', ward: 'Ward-4', severity: 'medium' },
            { type: 'success', message: 'Ward-1 vaccination target achieved', ward: 'Ward-1', severity: 'low' }
        ];

        // Calculate stats
        this.calculateStats();
        
        // Update dashboard
        this.updateDashboard();
    }

    // Calculate statistics
    calculateStats() {
        this.data.stats = {
            totalCases: this.data.cases.reduce((sum, item) => sum + item.totalCases, 0),
            availableBeds: this.data.hospitals.reduce((sum, h) => sum + h.availableBeds, 0),
            avgVaccinationRate: Math.round(this.data.vaccinations.reduce((sum, v) => sum + v.vaccinationRate, 0) / this.data.vaccinations.length),
            activeAlerts: this.data.alerts.length
        };
    }

    // Update dashboard with loaded data
    updateDashboard() {
        this.updateStats();
        this.updateCaseTable();
        this.updateAlertPanel();
        this.updateHeatmap();
        this.updateCharts();
        this.updateHospitalBedInfo();
        this.updateMedicineStockInfo();
        this.updateVaccinationCoverageInfo();
    }

    // Update statistics display
    updateStats() {
        const stats = this.data.stats;
        document.getElementById('totalCases').textContent = stats.totalCases || 0;
        document.getElementById('hospitalBeds').textContent = stats.availableBeds || 0;
        document.getElementById('vaccinationRate').textContent = `${stats.avgVaccinationRate || 0}%`;
        document.getElementById('outbreakAlerts').textContent = stats.activeAlerts || 0;
    }

    // Update case data table
    updateCaseTable() {
        const tbody = document.getElementById('caseDataTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        this.data.cases.forEach(caseItem => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${caseItem.ward}</td>
                <td>${caseItem.disease}</td>
                <td>${caseItem.newCases}</td>
                <td>${caseItem.totalCases}</td>
                <td><span class="status-badge status-${caseItem.status}">${caseItem.status}</span></td>
                <td>${this.formatTime(new Date(caseItem.lastUpdated))}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Update alert panel
    updateAlertPanel() {
        const alertPanel = document.getElementById('alertPanel');
        if (!alertPanel) return;
        
        alertPanel.innerHTML = '';

        this.data.alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${this.getAlertClass(alert.type)}`;
            alertDiv.innerHTML = `
                <small>
                    <i class="fas fa-${this.getAlertIcon(alert.type)} me-1"></i>
                    ${alert.message}
                    ${alert.ward ? `<br><small class="text-muted">Ward: ${alert.ward}</small>` : ''}
                </small>
            `;
            alertPanel.appendChild(alertDiv);
        });
    }

    // Get alert CSS class
    getAlertClass(type) {
        const classes = {
            'warning': 'warning',
            'success': 'success',
            'info': 'info',
            'error': 'danger'
        };
        return classes[type] || 'info';
    }

    // Get alert icon
    getAlertIcon(type) {
        const icons = {
            'warning': 'exclamation-triangle',
            'success': 'check-circle',
            'info': 'info-circle',
            'error': 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Initialize Leaflet map
    initializeMap() {
        if (document.getElementById('heatmap')) {
            this.map = L.map('heatmap').setView([12.9716, 77.5946], 11);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);
            
            this.addHeatmapData();
        }
    }

    // Add heatmap data to map
    addHeatmapData() {
        if (!this.map) return;

        const heatmapData = [
            { lat: 12.9716, lng: 77.5946, intensity: 0.8, ward: 'Ward-1', cases: 45 },
            { lat: 12.9352, lng: 77.6245, intensity: 0.6, ward: 'Ward-2', cases: 32 },
            { lat: 12.9239, lng: 77.5937, intensity: 0.9, ward: 'Ward-3', cases: 67 },
            { lat: 12.9147, lng: 77.6120, intensity: 0.4, ward: 'Ward-4', cases: 18 },
            { lat: 12.9048, lng: 77.6340, intensity: 0.7, ward: 'Ward-5', cases: 38 }
        ];
        
        heatmapData.forEach(point => {
            const color = this.getHeatmapColor(point.intensity);
            const circle = L.circle([point.lat, point.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.6,
                radius: point.cases * 50
            }).addTo(this.map);
            
            circle.bindPopup(`
                <strong>${point.ward}</strong><br>
                Active Cases: ${point.cases}<br>
                Risk Level: ${this.getRiskLevel(point.intensity)}
            `);
        });
        
        this.addHeatmapLegend();
    }

    // Get color based on intensity
    getHeatmapColor(intensity) {
        if (intensity >= 0.8) return '#d32f2f';
        if (intensity >= 0.6) return '#f57c00';
        if (intensity >= 0.4) return '#ffc107';
        return '#4caf50';
    }

    // Get risk level text
    getRiskLevel(intensity) {
        if (intensity >= 0.8) return 'Critical';
        if (intensity >= 0.6) return 'High';
        if (intensity >= 0.4) return 'Medium';
        return 'Low';
    }

    // Add heatmap legend
    addHeatmapLegend() {
        if (!this.map) return;

        const legend = L.control({position: 'bottomright'});
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'heatmap-legend');
            div.innerHTML = `
                <h6>Risk Level</h6>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #d32f2f;"></div>
                    <span>Critical</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #f57c00;"></div>
                    <span>High</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #ffc107;"></div>
                    <span>Medium</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #4caf50;"></div>
                    <span>Low</span>
                </div>
            `;
            return div;
        };
        legend.addTo(this.map);
    }

    // Initialize charts
    initializeCharts() {
        this.initializeHospitalChart();
        this.initializeVaccinationChart();
    }

    // Initialize hospital chart
    initializeHospitalChart() {
        const ctx = document.getElementById('hospitalChart');
        if (!ctx) return;

        const totalBeds = this.data.hospitals.reduce((sum, h) => sum + h.totalBeds, 0);
        const occupiedBeds = this.data.hospitals.reduce((sum, h) => sum + h.occupiedBeds, 0);
        const icuBeds = this.data.hospitals.reduce((sum, h) => sum + h.icuBeds, 0);
        const ventilators = this.data.hospitals.reduce((sum, h) => sum + h.ventilators, 0);

        this.charts.hospital = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Available Beds', 'Occupied Beds', 'ICU Beds', 'Ventilators'],
                datasets: [{
                    data: [totalBeds - occupiedBeds, occupiedBeds, icuBeds, ventilators],
                    backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#17a2b8'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Initialize vaccination chart
    initializeVaccinationChart() {
        const ctx = document.getElementById('vaccinationChart');
        if (!ctx) return;

        const wards = this.data.vaccinations.map(v => v.ward);
        const rates = this.data.vaccinations.map(v => v.vaccinationRate);

        this.charts.vaccination = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: wards,
                datasets: [{
                    label: 'Vaccination Rate (%)',
                    data: rates,
                    backgroundColor: '#17a2b8',
                    borderColor: '#138496',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 100 }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // Update heatmap
    updateHeatmap() {
        // Heatmap is updated when data changes
        console.log('Heatmap updated');
    }

    // Update charts
    updateCharts() {
        // Charts are updated when data changes
        console.log('Charts updated');
    }

    // Update hospital bed information
    updateHospitalBedInfo() {
        const container = document.getElementById('hospitalBedInfo');
        if (!container) return;

        let html = '';
        this.data.hospitals.forEach(hospital => {
            const occupancyRate = Math.round((hospital.occupiedBeds / hospital.totalBeds) * 100);
            const statusClass = occupancyRate >= 90 ? 'danger' : occupancyRate >= 70 ? 'warning' : 'success';
            const statusText = occupancyRate >= 90 ? 'Critical' : occupancyRate >= 70 ? 'High' : 'Good';
            
            html += `
                <div class="hospital-bed-item mb-2 p-2 border rounded">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${hospital.name}</strong><br>
                            <small class="text-muted">${hospital.ward}</small>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-${statusClass}">${statusText}</span><br>
                            <small>${hospital.occupiedBeds}/${hospital.totalBeds} beds</small>
                        </div>
                    </div>
                    <div class="progress mt-1" style="height: 6px;">
                        <div class="progress-bar bg-${statusClass}" style="width: ${occupancyRate}%"></div>
                    </div>
                    <div class="row mt-1">
                        <div class="col-6">
                            <small class="text-success">Available: ${hospital.availableBeds}</small>
                        </div>
                        <div class="col-6">
                            <small class="text-info">ICU: ${hospital.icuBeds}</small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    // Update medicine stock information
    updateMedicineStockInfo() {
        const container = document.getElementById('medicineStockInfo');
        if (!container) return;

        let html = '';
        this.data.hospitals.forEach(hospital => {
            html += `
                <div class="medicine-stock-item mb-2 p-2 border rounded">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong>${hospital.name}</strong>
                        <small class="text-muted">${hospital.ward}</small>
                    </div>
                    <div class="medicine-list">
            `;
            
            hospital.medicines.forEach(medicine => {
                const stockPercentage = Math.round((medicine.stock / medicine.required) * 100);
                const statusClass = medicine.status === 'critical' ? 'danger' : 
                                  medicine.status === 'low' ? 'warning' : 
                                  medicine.status === 'medium' ? 'info' : 'success';
                const statusText = medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1);
                
                html += `
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="small">${medicine.name}</span>
                        <div class="d-flex align-items-center">
                            <span class="badge bg-${statusClass} me-1">${statusText}</span>
                            <small class="text-muted">${medicine.stock}/${medicine.required}</small>
                        </div>
                    </div>
                    <div class="progress" style="height: 4px;">
                        <div class="progress-bar bg-${statusClass}" style="width: ${Math.min(stockPercentage, 100)}%"></div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    // Update vaccination coverage information
    updateVaccinationCoverageInfo() {
        const container = document.getElementById('vaccinationCoverageInfo');
        if (!container) return;

        let html = '';
        this.data.vaccinations.forEach(vaccination => {
            const coverageRate = vaccination.vaccinationRate;
            const statusClass = coverageRate >= 90 ? 'success' : 
                               coverageRate >= 75 ? 'info' : 
                               coverageRate >= 60 ? 'warning' : 'danger';
            const statusText = coverageRate >= 90 ? 'Excellent' : 
                              coverageRate >= 75 ? 'Good' : 
                              coverageRate >= 60 ? 'Moderate' : 'Low';
            
            const remainingPopulation = vaccination.totalPopulation - vaccination.vaccinated;
            const targetPopulation = Math.round(vaccination.totalPopulation * 0.9); // 90% target
            const progressToTarget = Math.min((coverageRate / 90) * 100, 100);
            
            html += `
                <div class="vaccination-coverage-item mb-2 p-2 border rounded">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${vaccination.ward}</strong><br>
                            <small class="text-muted">Population: ${vaccination.totalPopulation.toLocaleString()}</small>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-${statusClass}">${statusText}</span><br>
                            <small>${coverageRate}% Coverage</small>
                        </div>
                    </div>
                    <div class="progress mt-1" style="height: 8px;">
                        <div class="progress-bar bg-${statusClass}" style="width: ${coverageRate}%"></div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-6">
                            <small class="text-success">
                                <i class="fas fa-check-circle me-1"></i>
                                Vaccinated: ${vaccination.vaccinated.toLocaleString()}
                            </small>
                        </div>
                        <div class="col-6">
                            <small class="text-warning">
                                <i class="fas fa-users me-1"></i>
                                Remaining: ${remainingPopulation.toLocaleString()}
                            </small>
                        </div>
                    </div>
                    <div class="row mt-1">
                        <div class="col-12">
                            <small class="text-info">
                                <i class="fas fa-bullseye me-1"></i>
                                Target Progress: ${Math.round(progressToTarget)}% (Target: 90%)
                            </small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    // Setup event listeners
    setupEventListeners() {
        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.updateDashboard();
        }, 30000);
    }

    // Start real-time updates
    startRealTimeUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            // Randomly update some case data
            if (Math.random() > 0.7) {
                const randomIndex = Math.floor(Math.random() * this.data.cases.length);
                this.data.cases[randomIndex].newCases += Math.floor(Math.random() * 3);
                this.data.cases[randomIndex].totalCases += Math.floor(Math.random() * 3);
                this.data.cases[randomIndex].lastUpdated = new Date();
                
                this.calculateStats();
                this.updateDashboard();
            }
        }, 10000);
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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Try to initialize the enhanced dashboard first
    try {
        if (window.SevaNagarHealthDashboard) {
            window.dashboard = new SevaNagarHealthDashboard();
        } else {
            // Fallback to simple dashboard
            window.dashboard = new SevaNagarHealthDashboardFallback();
        }
    } catch (error) {
        console.log('Enhanced dashboard failed, using fallback:', error);
        // Use fallback dashboard
        window.dashboard = new SevaNagarHealthDashboardFallback();
    }
});

// Global functions for modal interactions
window.openDataUpload = () => {
    const modal = new bootstrap.Modal(document.getElementById('dataUploadModal'));
    modal.show();
};

window.uploadData = () => {
    if (window.dashboard && window.dashboard.uploadData) {
        window.dashboard.uploadData();
    } else {
        // Fallback upload
        const ward = document.getElementById('wardSelect').value;
        const disease = document.getElementById('diseaseSelect').value;
        const newCases = parseInt(document.getElementById('newCases').value);
        const totalActiveCases = parseInt(document.getElementById('totalActiveCases').value);
        
        if (ward && disease && !isNaN(newCases) && !isNaN(totalActiveCases)) {
            // Add to dashboard data
            if (window.dashboard && window.dashboard.data) {
                const newCaseData = {
                    ward: ward,
                    disease: disease,
                    newCases: newCases,
                    totalCases: totalActiveCases,
                    status: window.dashboard.getStatusFromCases ? window.dashboard.getStatusFromCases(totalActiveCases) : 'medium',
                    lastUpdated: new Date()
                };
                
                window.dashboard.data.cases.unshift(newCaseData);
                window.dashboard.calculateStats();
                window.dashboard.updateDashboard();
            }
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('dataUploadModal'));
            modal.hide();
            
            // Reset form
            document.getElementById('dataUploadForm').reset();
            
            alert('Data uploaded successfully!');
        } else {
            alert('Please fill in all fields');
        }
    }
};

window.openCitizenPortal = () => {
    const modal = new bootstrap.Modal(document.getElementById('citizenPortalModal'));
    modal.show();
};