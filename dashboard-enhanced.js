// Enhanced SevaNagar Health Dashboard with Backend Integration

class SevaNagarHealthDashboard {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.wsUrl = 'ws://localhost:3000';
        this.ws = null;
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
        console.log('Initializing Enhanced SevaNagar Health Dashboard...');
        
        // Initialize WebSocket connection
        this.initWebSocket();
        
        // Load initial data
        await this.loadAllData();
        
        // Initialize components
        this.initializeMap();
        this.initializeCharts();
        this.setupEventListeners();
        
        // Start real-time updates
        this.startRealTimeUpdates();
        
        console.log('Dashboard initialized successfully');
    }

    // Initialize WebSocket connection for real-time updates
    initWebSocket() {
        this.ws = new WebSocket(this.wsUrl);
        
        this.ws.onopen = () => {
            console.log('WebSocket connected');
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleRealtimeUpdate(data);
        };
        
        this.ws.onclose = () => {
            console.log('WebSocket disconnected. Attempting to reconnect...');
            setTimeout(() => this.initWebSocket(), 5000);
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    // Handle real-time updates from WebSocket
    handleRealtimeUpdate(data) {
        switch (data.type) {
            case 'case_update':
                this.updateCaseData(data.data);
                break;
            case 'hospital_update':
                this.updateHospitalData(data.data);
                break;
            case 'vaccination_update':
                this.updateVaccinationData(data.data);
                break;
            case 'new_alert':
                this.addNewAlert(data.data);
                break;
        }
    }

    // Load all data from API
    async loadAllData() {
        try {
            const [cases, hospitals, vaccinations, alerts, stats] = await Promise.all([
                this.fetchData('/cases'),
                this.fetchData('/hospitals'),
                this.fetchData('/vaccinations'),
                this.fetchData('/alerts'),
                this.fetchData('/stats')
            ]);

            this.data.cases = cases;
            this.data.hospitals = hospitals;
            this.data.vaccinations = vaccinations;
            this.data.alerts = alerts;
            this.data.stats = stats;

            this.updateDashboard();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('error', 'Failed to load dashboard data');
        }
    }

    // Generic API fetch function
    async fetchData(endpoint) {
        const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    // Update dashboard with loaded data
    updateDashboard() {
        this.updateStats();
        this.updateCaseTable();
        this.updateAlertPanel();
        this.updateHeatmap();
        this.updateCharts();
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
        tbody.innerHTML = '';

        this.data.cases.forEach(caseItem => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${caseItem.ward}</td>
                <td>${caseItem.disease}</td>
                <td>${caseItem.new_cases}</td>
                <td>${caseItem.total_cases}</td>
                <td><span class="status-badge status-${caseItem.status}">${caseItem.status}</span></td>
                <td>${this.formatTime(new Date(caseItem.updated_at))}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Update alert panel
    updateAlertPanel() {
        const alertPanel = document.getElementById('alertPanel');
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
        this.map = L.map('heatmap').setView([12.9716, 77.5946], 11);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        this.addHeatmapLegend();
    }

    // Update heatmap with current data
    updateHeatmap() {
        // Clear existing markers
        this.map.eachLayer(layer => {
            if (layer instanceof L.Circle) {
                this.map.removeLayer(layer);
            }
        });

        // Add markers for each case
        this.data.cases.forEach(caseItem => {
            const hospital = this.data.hospitals.find(h => h.ward === caseItem.ward);
            if (hospital && hospital.latitude && hospital.longitude) {
                const intensity = this.calculateIntensity(caseItem.total_cases);
                const color = this.getHeatmapColor(intensity);
                
                const circle = L.circle([hospital.latitude, hospital.longitude], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.6,
                    radius: caseItem.total_cases * 30
                }).addTo(this.map);
                
                circle.bindPopup(`
                    <strong>${caseItem.ward}</strong><br>
                    Disease: ${caseItem.disease}<br>
                    Active Cases: ${caseItem.total_cases}<br>
                    New Cases: ${caseItem.new_cases}<br>
                    Risk Level: ${this.getRiskLevel(intensity)}
                `);
            }
        });
    }

    // Calculate intensity based on case count
    calculateIntensity(cases) {
        if (cases >= 60) return 0.9;
        if (cases >= 40) return 0.7;
        if (cases >= 20) return 0.5;
        return 0.3;
    }

    // Get heatmap color
    getHeatmapColor(intensity) {
        if (intensity >= 0.8) return '#d32f2f';
        if (intensity >= 0.6) return '#f57c00';
        if (intensity >= 0.4) return '#ffc107';
        return '#4caf50';
    }

    // Get risk level
    getRiskLevel(intensity) {
        if (intensity >= 0.8) return 'Critical';
        if (intensity >= 0.6) return 'High';
        if (intensity >= 0.4) return 'Medium';
        return 'Low';
    }

    // Add heatmap legend
    addHeatmapLegend() {
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
        const ctx = document.getElementById('hospitalChart').getContext('2d');
        this.charts.hospital = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Available Beds', 'Occupied Beds', 'ICU Beds', 'Ventilators'],
                datasets: [{
                    data: [0, 0, 0, 0],
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
        const ctx = document.getElementById('vaccinationChart').getContext('2d');
        this.charts.vaccination = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Vaccination Rate (%)',
                    data: [],
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

    // Update charts with current data
    updateCharts() {
        this.updateHospitalChart();
        this.updateVaccinationChart();
    }

    // Update hospital chart
    updateHospitalChart() {
        if (!this.charts.hospital) return;

        const totalBeds = this.data.hospitals.reduce((sum, h) => sum + h.total_beds, 0);
        const occupiedBeds = this.data.hospitals.reduce((sum, h) => sum + h.occupied_beds, 0);
        const icuBeds = this.data.hospitals.reduce((sum, h) => sum + h.icu_beds, 0);
        const ventilators = this.data.hospitals.reduce((sum, h) => sum + h.ventilators, 0);

        this.charts.hospital.data.datasets[0].data = [
            totalBeds - occupiedBeds,
            occupiedBeds,
            icuBeds,
            ventilators
        ];
        this.charts.hospital.update();
    }

    // Update vaccination chart
    updateVaccinationChart() {
        if (!this.charts.vaccination) return;

        const wards = this.data.vaccinations.map(v => v.ward);
        const rates = this.data.vaccinations.map(v => v.vaccination_rate);

        this.charts.vaccination.data.labels = wards;
        this.charts.vaccination.data.datasets[0].data = rates;
        this.charts.vaccination.update();
    }

    // Update case data
    updateCaseData(data) {
        const index = this.data.cases.findIndex(c => c.id === data.id);
        if (index >= 0) {
            this.data.cases[index] = { ...this.data.cases[index], ...data };
        } else {
            this.data.cases.unshift(data);
        }
        this.updateCaseTable();
        this.updateHeatmap();
        this.updateStats();
    }

    // Update hospital data
    updateHospitalData(data) {
        const index = this.data.hospitals.findIndex(h => h.id === data.id);
        if (index >= 0) {
            this.data.hospitals[index] = { ...this.data.hospitals[index], ...data };
            this.updateHospitalChart();
            this.updateStats();
        }
    }

    // Update vaccination data
    updateVaccinationData(data) {
        const index = this.data.vaccinations.findIndex(v => v.ward === data.ward);
        if (index >= 0) {
            this.data.vaccinations[index] = { ...this.data.vaccinations[index], ...data };
            this.updateVaccinationChart();
            this.updateStats();
        }
    }

    // Add new alert
    addNewAlert(data) {
        this.data.alerts.unshift(data);
        this.updateAlertPanel();
        this.updateStats();
        this.showNotification(data.type, data.message);
    }

    // Setup event listeners
    setupEventListeners() {
        // Data upload form
        document.getElementById('dataUploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.uploadData();
        });

        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.loadAllData();
        }, 30000);
    }

    // Upload case data
    async uploadData() {
        const formData = {
            ward: document.getElementById('wardSelect').value,
            disease: document.getElementById('diseaseSelect').value,
            newCases: parseInt(document.getElementById('newCases').value),
            totalCases: parseInt(document.getElementById('totalCases').value),
            status: this.getStatusFromCases(parseInt(document.getElementById('totalCases').value))
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/cases`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showNotification('success', 'Data uploaded successfully');
                document.getElementById('dataUploadForm').reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('dataUploadModal'));
                modal.hide();
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showNotification('error', 'Failed to upload data');
        }
    }

    // Get status from case count
    getStatusFromCases(cases) {
        if (cases >= 60) return 'critical';
        if (cases >= 40) return 'high';
        if (cases >= 20) return 'medium';
        return 'low';
    }

    // Start real-time updates
    startRealTimeUpdates() {
        // Additional real-time logic can be added here
        console.log('Real-time updates started');
    }

    // Show notification
    showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getAlertIcon(type)} me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
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
    window.dashboard = new SevaNagarHealthDashboard();
});

// Global functions for modal interactions
window.openDataUpload = () => {
    const modal = new bootstrap.Modal(document.getElementById('dataUploadModal'));
    modal.show();
};

window.uploadData = () => {
    if (window.dashboard) {
        window.dashboard.uploadData();
    }
};

window.openCitizenPortal = () => {
    const modal = new bootstrap.Modal(document.getElementById('citizenPortalModal'));
    modal.show();
};