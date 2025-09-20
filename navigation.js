// Navigation functionality for SevaNagar Health Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from href
            const targetId = this.getAttribute('href').substring(1);
            
            // Show the target section
            showSection(targetId);
            
            // Update active navigation link
            updateActiveNavLink(this);
        });
    });
    
    // Show the default dashboard section
    showSection('dashboard');
});

// Function to show a specific section
function showSection(sectionId) {
    // Hide all sections
    const allSections = document.querySelectorAll('.dashboard-section');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Initialize section-specific content
        initializeSection(sectionId);
    }
}

// Function to update active navigation link
function updateActiveNavLink(activeLink) {
    // Remove active class from all nav links
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('active');
}

// Function to initialize section-specific content
function initializeSection(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            // Dashboard is already initialized by the main script
            break;
            
        case 'outbreaks':
            initializeOutbreaksSection();
            break;
            
        case 'hospitals':
            initializeHospitalsSection();
            break;
            
        case 'vaccination':
            initializeVaccinationSection();
            break;
            
        case 'wardCases':
            initializeWardCasesSection();
            break;
            
        case 'citizen':
            initializeCitizenSection();
            break;
    }
}

// Initialize Outbreaks section
function initializeOutbreaksSection() {
    // Initialize outbreak heatmap if not already done
    if (!window.outbreakMap) {
        window.outbreakMap = L.map('outbreakHeatmap').setView([12.9716, 77.5946], 11);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(window.outbreakMap);
        
        // Add outbreak data
        addOutbreakData();
    }
    
    // Update outbreak statistics
    updateOutbreakStats();
    
    // Initialize outbreak charts
    initializeOutbreakCharts();
}

// Add outbreak data to map
function addOutbreakData() {
    const outbreakData = [
        { lat: 12.9716, lng: 77.5946, ward: 'Ward-1', cases: 45, disease: 'Dengue', severity: 'high' },
        { lat: 12.9352, lng: 77.6245, ward: 'Ward-2', cases: 32, disease: 'Flu', severity: 'medium' },
        { lat: 12.9239, lng: 77.5937, ward: 'Ward-3', cases: 67, disease: 'Dengue', severity: 'critical' },
        { lat: 12.9147, lng: 77.6120, ward: 'Ward-4', cases: 18, disease: 'COVID-19', severity: 'low' },
        { lat: 12.9048, lng: 77.6340, ward: 'Ward-5', cases: 38, disease: 'Malaria', severity: 'medium' }
    ];
    
    outbreakData.forEach(point => {
        const color = getSeverityColor(point.severity);
        const circle = L.circle([point.lat, point.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.6,
            radius: point.cases * 30
        }).addTo(window.outbreakMap);
        
        circle.bindPopup(`
            <strong>${point.ward}</strong><br>
            Disease: ${point.disease}<br>
            Cases: ${point.cases}<br>
            Severity: ${point.severity.toUpperCase()}
        `);
    });
}

// Get color based on severity
function getSeverityColor(severity) {
    const colors = {
        'critical': '#d32f2f',
        'high': '#f57c00',
        'medium': '#ffc107',
        'low': '#4caf50'
    };
    return colors[severity] || '#4caf50';
}

// Initialize outbreak charts
function initializeOutbreakCharts() {
    // Get outbreak data from heatmap manager if available
    let outbreakData = [];
    if (window.heatmapManager) {
        outbreakData = window.heatmapManager.getWardData();
    } else {
        // Fallback data
        outbreakData = [
            { ward: 'Ward-1', cases: 45, disease: 'Dengue', riskLevel: 'high' },
            { ward: 'Ward-2', cases: 32, disease: 'Flu', riskLevel: 'medium' },
            { ward: 'Ward-3', cases: 67, disease: 'Dengue', riskLevel: 'critical' },
            { ward: 'Ward-4', cases: 18, disease: 'COVID-19', riskLevel: 'low' },
            { ward: 'Ward-5', cases: 38, disease: 'Malaria', riskLevel: 'medium' }
        ];
    }
    
    // Create outbreak trend chart
    createOutbreakTrendChart(outbreakData);
    
    // Create disease distribution chart
    createDiseaseDistributionChart(outbreakData);
}

// Create outbreak trend chart
function createOutbreakTrendChart(data) {
    const ctx = document.getElementById('outbreakTrendChart');
    if (!ctx) return;
    
    const wards = data.map(d => d.ward);
    const cases = data.map(d => d.cases);
    const colors = data.map(d => getSeverityColor(d.riskLevel));
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: wards,
            datasets: [{
                label: 'Active Cases',
                data: cases,
                backgroundColor: colors,
                borderColor: colors.map(c => darkenColor(c)),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true },
                x: { title: { display: true, text: 'Wards' } }
            },
            plugins: {
                title: { display: true, text: 'Outbreak Cases by Ward' },
                legend: { display: false }
            }
        }
    });
}

// Create disease distribution chart
function createDiseaseDistributionChart(data) {
    const ctx = document.getElementById('diseaseDistributionChart');
    if (!ctx) return;
    
    // Count diseases
    const diseaseCount = {};
    data.forEach(d => {
        diseaseCount[d.disease] = (diseaseCount[d.disease] || 0) + 1;
    });
    
    const diseases = Object.keys(diseaseCount);
    const counts = Object.values(diseaseCount);
    const colors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: diseases,
            datasets: [{
                data: counts,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Disease Distribution' },
                legend: { position: 'bottom' }
            }
        }
    });
}

// Update outbreak statistics
function updateOutbreakStats() {
    // Get data from heatmap manager if available
    let outbreakData = [];
    if (window.heatmapManager) {
        outbreakData = window.heatmapManager.getWardData();
    } else {
        // Fallback data
        outbreakData = [
            { ward: 'Ward-1', cases: 45, disease: 'Dengue', riskLevel: 'high' },
            { ward: 'Ward-2', cases: 32, disease: 'Flu', riskLevel: 'medium' },
            { ward: 'Ward-3', cases: 67, disease: 'Dengue', riskLevel: 'critical' },
            { ward: 'Ward-4', cases: 18, disease: 'COVID-19', riskLevel: 'low' },
            { ward: 'Ward-5', cases: 38, disease: 'Malaria', riskLevel: 'medium' }
        ];
    }
    
    const totalOutbreaks = outbreakData.length;
    const criticalWards = outbreakData.filter(d => d.riskLevel === 'critical').length;
    const uniqueDiseases = [...new Set(outbreakData.map(d => d.disease))].length;
    
    document.getElementById('totalOutbreaks').textContent = totalOutbreaks;
    document.getElementById('criticalWards').textContent = criticalWards;
    document.getElementById('trendingDiseases').textContent = uniqueDiseases;
}

// Get severity color
function getSeverityColor(severity) {
    const colors = {
        'critical': '#d32f2f',
        'high': '#f57c00',
        'medium': '#ffc107',
        'low': '#4caf50'
    };
    return colors[severity] || '#4caf50';
}

// Darken color
function darkenColor(color) {
    return color.replace('rgb(', 'rgba(').replace(')', ', 0.8)');
}

// Initialize Hospitals section
function initializeHospitalsSection() {
    // Initialize hospital resource chart
    if (!window.hospitalResourceChart) {
        const ctx = document.getElementById('hospitalResourceChart').getContext('2d');
        window.hospitalResourceChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Available Beds', 'Occupied Beds', 'ICU Beds', 'Ventilators'],
                datasets: [{
                    data: [65, 35, 12, 8],
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
    
    // Initialize medicine chart
    if (!window.medicineChart) {
        const ctx = document.getElementById('medicineChart').getContext('2d');
        window.medicineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Paracetamol', 'Oxygen', 'Antibiotics', 'Vaccines'],
                datasets: [{
                    label: 'Stock Level',
                    data: [1200, 140, 550, 340],
                    backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#6f42c1'],
                    borderColor: ['#1e7e34', '#138496', '#e0a800', '#5a32a3'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Medicine Stock Levels'
                    }
                }
            }
        });
    }
    
    // Update hospital list
    updateHospitalList();
}

// Update hospital list
function updateHospitalList() {
    const hospitalList = document.getElementById('hospitalList');
    const hospitals = [
        { name: 'SevaNagar General Hospital', ward: 'Ward-1', beds: 100, occupied: 65, status: 'high' },
        { name: 'City Medical Center', ward: 'Ward-2', beds: 80, occupied: 45, status: 'medium' },
        { name: 'Emergency Care Hospital', ward: 'Ward-3', beds: 120, occupied: 90, status: 'critical' },
        { name: 'Community Health Center', ward: 'Ward-4', beds: 60, occupied: 30, status: 'low' },
        { name: 'Rural Medical Center', ward: 'Ward-5', beds: 70, occupied: 40, status: 'medium' }
    ];
    
    hospitalList.innerHTML = '';
    hospitals.forEach(hospital => {
        const hospitalDiv = document.createElement('div');
        hospitalDiv.className = 'hospital-item mb-3 p-3 border rounded';
        hospitalDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${hospital.name}</h6>
                    <small class="text-muted">${hospital.ward}</small>
                </div>
                <div class="text-end">
                    <div class="badge bg-${getStatusColor(hospital.status)}">${hospital.occupied}/${hospital.beds}</div>
                    <div class="small text-muted">${hospital.status.toUpperCase()}</div>
                </div>
            </div>
        `;
        hospitalList.appendChild(hospitalDiv);
    });
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'critical': 'danger',
        'high': 'warning',
        'medium': 'info',
        'low': 'success'
    };
    return colors[status] || 'secondary';
}

// Initialize Vaccination section
function initializeVaccinationSection() {
    // Initialize vaccination coverage chart
    if (!window.vaccinationCoverageChart) {
        const ctx = document.getElementById('vaccinationCoverageChart').getContext('2d');
        window.vaccinationCoverageChart = new Chart(ctx, {
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
                    y: { beginAtZero: true, max: 100 }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
    
    // Update coverage statistics
    updateCoverageStats();
}

// Update coverage statistics
function updateCoverageStats() {
    document.getElementById('avgCoverage').textContent = '79%';
    document.getElementById('targetWards').textContent = '2';
    document.getElementById('completedWards').textContent = '3';
}

// Initialize Ward Cases section
function initializeWardCasesSection() {
    // Initialize ward case management if available
    if (window.wardCaseManager) {
        window.wardCaseManager.updateWardCaseDisplay();
    }
}

// Initialize Citizen section
function initializeCitizenSection() {
    // Load citizen alerts
    loadCitizenAlerts();
    
    // Load prevention tips
    loadPreventionTips();
}

// Load citizen alerts
function loadCitizenAlerts() {
    const alertsSection = document.getElementById('citizenAlertsSection');
    alertsSection.innerHTML = `
        <div class="citizen-alert mb-3">
            <strong>Dengue Alert</strong><br>
            <small>Ward-3 experiencing high dengue cases. Use mosquito repellent and clear standing water.</small>
        </div>
        <div class="citizen-alert mb-3">
            <strong>Vaccination Drive</strong><br>
            <small>Free flu vaccination available at all government hospitals this week.</small>
        </div>
        <div class="citizen-alert mb-3">
            <strong>Health Advisory</strong><br>
            <small>Maintain social distancing in crowded areas and wear masks when necessary.</small>
        </div>
    `;
}

// Load prevention tips
function loadPreventionTips() {
    const tipsSection = document.getElementById('preventionTipsSection');
    tipsSection.innerHTML = `
        <div class="prevention-tip mb-3">
            <strong>Mosquito Prevention</strong><br>
            <small>Empty containers with standing water, use mosquito nets, and apply repellent.</small>
        </div>
        <div class="prevention-tip mb-3">
            <strong>Hand Hygiene</strong><br>
            <small>Wash hands frequently with soap and water for at least 20 seconds.</small>
        </div>
        <div class="prevention-tip mb-3">
            <strong>Social Distancing</strong><br>
            <small>Maintain at least 6 feet distance in crowded areas.</small>
        </div>
        <div class="prevention-tip mb-3">
            <strong>Vaccination</strong><br>
            <small>Get vaccinated as per the schedule and keep your vaccination records updated.</small>
        </div>
    `;
}