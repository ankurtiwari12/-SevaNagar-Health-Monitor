// SevaNagar Health Monitoring Dashboard JavaScript

// Global variables
let map;
let hospitalChart;
let vaccinationChart;
let caseData = [];
let alertData = [];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeMap();
    initializeCharts();
    startRealTimeUpdates();
    loadInitialData();
});

// Initialize dashboard components
function initializeDashboard() {
    console.log('Initializing SevaNagar Health Dashboard...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize real-time data
    updateDashboardStats();
    
    // Load sample data
    loadSampleData();
}

// Set up event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            showSection(target);
        });
    });
    
    // Auto-refresh every 30 seconds
    setInterval(updateDashboardStats, 30000);
}

// Show specific section
function showSection(sectionId) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    event.target.classList.add('active');
    
    // Show/hide sections based on selection
    // This is a simplified version - in a real app, you'd have separate pages/sections
    console.log(`Showing section: ${sectionId}`);
}

// Initialize Leaflet map for heatmap
function initializeMap() {
    map = L.map('heatmap').setView([12.9716, 77.5946], 11); // Bangalore coordinates as proxy for SevaNagar
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add sample heatmap data
    addHeatmapData();
}

// Add heatmap data to map
function addHeatmapData() {
    const heatmapData = [
        { lat: 12.9716, lng: 77.5946, intensity: 0.8, ward: 'Ward-1', cases: 45 },
        { lat: 12.9352, lng: 77.6245, intensity: 0.6, ward: 'Ward-2', cases: 32 },
        { lat: 12.9239, lng: 77.5937, intensity: 0.9, ward: 'Ward-3', cases: 67 },
        { lat: 12.9147, lng: 77.6120, intensity: 0.4, ward: 'Ward-4', cases: 18 },
        { lat: 12.9048, lng: 77.6340, intensity: 0.7, ward: 'Ward-5', cases: 38 }
    ];
    
    heatmapData.forEach(point => {
        const color = getHeatmapColor(point.intensity);
        const circle = L.circle([point.lat, point.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.6,
            radius: point.cases * 50
        }).addTo(map);
        
        circle.bindPopup(`
            <strong>${point.ward}</strong><br>
            Active Cases: ${point.cases}<br>
            Risk Level: ${getRiskLevel(point.intensity)}
        `);
    });
    
    // Add legend
    addHeatmapLegend();
}

// Get color based on intensity
function getHeatmapColor(intensity) {
    if (intensity >= 0.8) return '#d32f2f'; // Red - High risk
    if (intensity >= 0.6) return '#f57c00'; // Orange - Medium-High risk
    if (intensity >= 0.4) return '#ffc107'; // Yellow - Medium risk
    return '#4caf50'; // Green - Low risk
}

// Get risk level text
function getRiskLevel(intensity) {
    if (intensity >= 0.8) return 'Critical';
    if (intensity >= 0.6) return 'High';
    if (intensity >= 0.4) return 'Medium';
    return 'Low';
}

// Add heatmap legend
function addHeatmapLegend() {
    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
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
    legend.addTo(map);
}

// Initialize charts
function initializeCharts() {
    initializeHospitalChart();
    initializeVaccinationChart();
}

// Initialize hospital resources chart
function initializeHospitalChart() {
    const ctx = document.getElementById('hospitalChart').getContext('2d');
    hospitalChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Available Beds', 'Occupied Beds', 'ICU Beds', 'Ventilators'],
            datasets: [{
                data: [65, 35, 12, 8],
                backgroundColor: [
                    '#28a745',
                    '#dc3545',
                    '#ffc107',
                    '#17a2b8'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initialize vaccination chart
function initializeVaccinationChart() {
    const ctx = document.getElementById('vaccinationChart').getContext('2d');
    vaccinationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'],
            datasets: [{
                label: 'Vaccination Rate (%)',
                data: [85, 72, 91, 68, 78],
                backgroundColor: '#17a2b8',
                borderColor: '#138496',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Load initial data
function loadInitialData() {
    loadCaseData();
    loadAlertData();
    loadCitizenData();
}

// Load sample case data
function loadCaseData() {
    caseData = [
        { ward: 'Ward-1', disease: 'Dengue', newCases: 12, totalCases: 45, status: 'high', lastUpdated: new Date() },
        { ward: 'Ward-2', disease: 'Flu', newCases: 8, totalCases: 32, status: 'medium', lastUpdated: new Date() },
        { ward: 'Ward-3', disease: 'Dengue', newCases: 15, totalCases: 67, status: 'critical', lastUpdated: new Date() },
        { ward: 'Ward-4', disease: 'COVID-19', newCases: 3, totalCases: 18, status: 'low', lastUpdated: new Date() },
        { ward: 'Ward-5', disease: 'Malaria', newCases: 6, totalCases: 38, status: 'medium', lastUpdated: new Date() }
    ];
    
    updateCaseDataTable();
}

// Update case data table
function updateCaseDataTable() {
    const tbody = document.getElementById('caseDataTable');
    tbody.innerHTML = '';
    
    caseData.forEach(caseItem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${caseItem.ward}</td>
            <td>${caseItem.disease}</td>
            <td>${caseItem.newCases}</td>
            <td>${caseItem.totalCases}</td>
            <td><span class="status-badge status-${caseItem.status}">${caseItem.status}</span></td>
            <td>${formatTime(caseItem.lastUpdated)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Load alert data
function loadAlertData() {
    alertData = [
        { type: 'warning', message: 'Dengue outbreak detected in Ward-3', timestamp: new Date() },
        { type: 'info', message: 'Vaccination drive scheduled for Ward-4', timestamp: new Date() },
        { type: 'success', message: 'Ward-1 vaccination target achieved', timestamp: new Date() }
    ];
    
    updateAlertPanel();
}

// Update alert panel
function updateAlertPanel() {
    const alertPanel = document.getElementById('alertPanel');
    alertPanel.innerHTML = '';
    
    alertData.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${alert.type === 'warning' ? 'warning' : alert.type === 'success' ? 'success' : 'info'}`;
        alertDiv.innerHTML = `
            <small>
                <i class="fas fa-${alert.type === 'warning' ? 'exclamation-triangle' : alert.type === 'success' ? 'check-circle' : 'info-circle'} me-1"></i>
                ${alert.message}
            </small>
        `;
        alertPanel.appendChild(alertDiv);
    });
}

// Load citizen portal data
function loadCitizenData() {
    const citizenAlerts = document.getElementById('citizenAlerts');
    const preventionTips = document.getElementById('preventionTips');
    
    // Citizen alerts
    citizenAlerts.innerHTML = `
        <div class="citizen-alert">
            <strong>Dengue Alert</strong><br>
            <small>Ward-3 experiencing high dengue cases. Use mosquito repellent and clear standing water.</small>
        </div>
        <div class="citizen-alert">
            <strong>Vaccination Drive</strong><br>
            <small>Free flu vaccination available at all government hospitals this week.</small>
        </div>
    `;
    
    // Prevention tips
    preventionTips.innerHTML = `
        <div class="prevention-tip">
            <strong>Mosquito Prevention</strong><br>
            <small>Empty containers with standing water, use mosquito nets, and apply repellent.</small>
        </div>
        <div class="prevention-tip">
            <strong>Hand Hygiene</strong><br>
            <small>Wash hands frequently with soap and water for at least 20 seconds.</small>
        </div>
        <div class="prevention-tip">
            <strong>Social Distancing</strong><br>
            <small>Maintain at least 6 feet distance in crowded areas.</small>
        </div>
    `;
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalCases = caseData.reduce((sum, item) => sum + item.totalCases, 0);
    const hospitalBeds = Math.floor(Math.random() * 50) + 20; // Simulated data
    const vaccinationRate = Math.floor(Math.random() * 20) + 75; // Simulated data
    const outbreakAlerts = alertData.filter(alert => alert.type === 'warning').length;
    
    document.getElementById('totalCases').textContent = totalCases;
    document.getElementById('hospitalBeds').textContent = hospitalBeds;
    document.getElementById('vaccinationRate').textContent = vaccinationRate + '%';
    document.getElementById('outbreakAlerts').textContent = outbreakAlerts;
}

// Start real-time updates
function startRealTimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
        // Randomly update some case data
        if (Math.random() > 0.7) {
            const randomIndex = Math.floor(Math.random() * caseData.length);
            caseData[randomIndex].newCases += Math.floor(Math.random() * 3);
            caseData[randomIndex].totalCases += Math.floor(Math.random() * 3);
            caseData[randomIndex].lastUpdated = new Date();
            
            updateCaseDataTable();
            updateDashboardStats();
            
            // Check for outbreak threshold
            checkOutbreakThreshold(caseData[randomIndex]);
        }
    }, 10000); // Update every 10 seconds
}

// Check for outbreak threshold
function checkOutbreakThreshold(caseItem) {
    if (caseItem.newCases > 10) {
        addAlert('warning', `High case count detected in ${caseItem.ward}: ${caseItem.newCases} new cases`);
    }
}

// Add new alert
function addAlert(type, message) {
    const alert = {
        type: type,
        message: message,
        timestamp: new Date()
    };
    
    alertData.unshift(alert);
    
    // Keep only last 10 alerts
    if (alertData.length > 10) {
        alertData.pop();
    }
    
    updateAlertPanel();
    updateDashboardStats();
    showNotification(type, message);
}

// Show notification
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Open data upload modal
function openDataUpload() {
    const modal = new bootstrap.Modal(document.getElementById('dataUploadModal'));
    modal.show();
}

// Upload data
function uploadData() {
    const ward = document.getElementById('wardSelect').value;
    const disease = document.getElementById('diseaseSelect').value;
    const newCases = parseInt(document.getElementById('newCases').value);
    const totalCases = parseInt(document.getElementById('totalCases').value);
    
    if (!ward || !disease || isNaN(newCases) || isNaN(totalCases)) {
        showNotification('error', 'Please fill in all fields');
        return;
    }
    
    // Add new case data
    const newCaseItem = {
        ward: ward,
        disease: disease,
        newCases: newCases,
        totalCases: totalCases,
        status: getStatusFromCases(totalCases),
        lastUpdated: new Date()
    };
    
    // Check if ward already exists
    const existingIndex = caseData.findIndex(item => item.ward === ward && item.disease === disease);
    if (existingIndex >= 0) {
        caseData[existingIndex] = newCaseItem;
    } else {
        caseData.push(newCaseItem);
    }
    
    updateCaseDataTable();
    updateDashboardStats();
    updateHeatmap();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('dataUploadModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('dataUploadForm').reset();
    
    showNotification('success', 'Data uploaded successfully');
}

// Get status based on case count
function getStatusFromCases(cases) {
    if (cases >= 60) return 'critical';
    if (cases >= 40) return 'high';
    if (cases >= 20) return 'medium';
    return 'low';
}

// Update heatmap
function updateHeatmap() {
    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Circle) {
            map.removeLayer(layer);
        }
    });
    
    // Add updated heatmap data
    addHeatmapData();
}

// Open citizen portal
function openCitizenPortal() {
    const modal = new bootstrap.Modal(document.getElementById('citizenPortalModal'));
    modal.show();
}

// Load sample data
function loadSampleData() {
    // This function loads initial sample data for demonstration
    console.log('Loading sample data...');
    
    // Simulate some initial alerts
    setTimeout(() => {
        addAlert('info', 'System monitoring active - All systems operational');
    }, 2000);
}

// Format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Export functions for global access
window.openDataUpload = openDataUpload;
window.uploadData = uploadData;
window.openCitizenPortal = openCitizenPortal;