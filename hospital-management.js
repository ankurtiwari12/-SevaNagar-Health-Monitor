// Hospital Resource Management System for SevaNagar Health Dashboard

class HospitalManager {
    constructor() {
        this.hospitals = [
            {
                id: 1,
                name: 'SevaNagar General Hospital',
                ward: 'Ward-1',
                totalBeds: 100,
                occupiedBeds: 65,
                availableBeds: 35,
                icuBeds: 20,
                occupiedIcu: 15,
                availableIcu: 5,
                ventilators: 15,
                availableVentilators: 8,
                medicines: {
                    'Paracetamol': { stock: 500, required: 200, status: 'sufficient' },
                    'Oxygen': { stock: 50, required: 30, status: 'sufficient' },
                    'Antibiotics': { stock: 200, required: 150, status: 'sufficient' },
                    'Vaccines': { stock: 100, required: 80, status: 'sufficient' }
                },
                latitude: 12.9716,
                longitude: 77.5946,
                lastUpdate: new Date()
            },
            {
                id: 2,
                name: 'City Medical Center',
                ward: 'Ward-2',
                totalBeds: 80,
                occupiedBeds: 45,
                availableBeds: 35,
                icuBeds: 15,
                occupiedIcu: 10,
                availableIcu: 5,
                ventilators: 12,
                availableVentilators: 7,
                medicines: {
                    'Paracetamol': { stock: 300, required: 150, status: 'sufficient' },
                    'Oxygen': { stock: 30, required: 25, status: 'sufficient' },
                    'Antibiotics': { stock: 150, required: 100, status: 'sufficient' },
                    'Vaccines': { stock: 80, required: 60, status: 'sufficient' }
                },
                latitude: 12.9352,
                longitude: 77.6245,
                lastUpdate: new Date()
            },
            {
                id: 3,
                name: 'Emergency Care Hospital',
                ward: 'Ward-3',
                totalBeds: 120,
                occupiedBeds: 90,
                availableBeds: 30,
                icuBeds: 25,
                occupiedIcu: 20,
                availableIcu: 5,
                ventilators: 20,
                availableVentilators: 5,
                medicines: {
                    'Paracetamol': { stock: 200, required: 300, status: 'low' },
                    'Oxygen': { stock: 20, required: 40, status: 'critical' },
                    'Antibiotics': { stock: 100, required: 200, status: 'low' },
                    'Vaccines': { stock: 50, required: 100, status: 'low' }
                },
                latitude: 12.9239,
                longitude: 77.5937,
                lastUpdate: new Date()
            },
            {
                id: 4,
                name: 'Community Health Center',
                ward: 'Ward-4',
                totalBeds: 60,
                occupiedBeds: 30,
                availableBeds: 30,
                icuBeds: 10,
                occupiedIcu: 5,
                availableIcu: 5,
                ventilators: 8,
                availableVentilators: 6,
                medicines: {
                    'Paracetamol': { stock: 400, required: 100, status: 'sufficient' },
                    'Oxygen': { stock: 40, required: 20, status: 'sufficient' },
                    'Antibiotics': { stock: 180, required: 80, status: 'sufficient' },
                    'Vaccines': { stock: 120, required: 50, status: 'sufficient' }
                },
                latitude: 12.9147,
                longitude: 77.6120,
                lastUpdate: new Date()
            },
            {
                id: 5,
                name: 'Rural Medical Center',
                ward: 'Ward-5',
                totalBeds: 70,
                occupiedBeds: 40,
                availableBeds: 30,
                icuBeds: 12,
                occupiedIcu: 8,
                availableIcu: 4,
                ventilators: 10,
                availableVentilators: 7,
                medicines: {
                    'Paracetamol': { stock: 250, required: 120, status: 'sufficient' },
                    'Oxygen': { stock: 25, required: 20, status: 'sufficient' },
                    'Antibiotics': { stock: 120, required: 100, status: 'sufficient' },
                    'Vaccines': { stock: 90, required: 70, status: 'sufficient' }
                },
                latitude: 12.9048,
                longitude: 77.6340,
                lastUpdate: new Date()
            }
        ];
        
        this.initializeHospitalManagement();
    }

    initializeHospitalManagement() {
        this.updateHospitalCharts();
        this.updateHospitalList();
        this.setupEventListeners();
    }

    // Update hospital resource charts
    updateHospitalCharts() {
        this.updateHospitalResourceChart();
        this.updateMedicineChart();
    }

    // Update hospital resource chart
    updateHospitalResourceChart() {
        const ctx = document.getElementById('hospitalResourceChart');
        if (!ctx) return;

        const totalBeds = this.hospitals.reduce((sum, h) => sum + h.totalBeds, 0);
        const occupiedBeds = this.hospitals.reduce((sum, h) => sum + h.occupiedBeds, 0);
        const availableBeds = totalBeds - occupiedBeds;
        const totalIcu = this.hospitals.reduce((sum, h) => sum + h.icuBeds, 0);
        const occupiedIcu = this.hospitals.reduce((sum, h) => sum + h.occupiedIcu, 0);
        const totalVentilators = this.hospitals.reduce((sum, h) => sum + h.ventilators, 0);
        const availableVentilators = this.hospitals.reduce((sum, h) => sum + h.availableVentilators, 0);

        if (window.hospitalResourceChart && typeof window.hospitalResourceChart.destroy === 'function') {
            window.hospitalResourceChart.destroy();
        }

        window.hospitalResourceChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Available Beds', 'Occupied Beds', 'ICU Beds', 'Available ICU', 'Ventilators', 'Available Ventilators'],
                datasets: [{
                    data: [availableBeds, occupiedBeds, totalIcu, occupiedIcu, totalVentilators, availableVentilators],
                    backgroundColor: [
                        '#28a745', // Available beds - green
                        '#dc3545', // Occupied beds - red
                        '#ffc107', // ICU beds - yellow
                        '#fd7e14', // Occupied ICU - orange
                        '#17a2b8', // Ventilators - blue
                        '#6f42c1'  // Available ventilators - purple
                    ],
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
                        text: 'Hospital Resource Overview'
                    }
                }
            }
        });
    }

    // Update medicine chart
    updateMedicineChart() {
        const ctx = document.getElementById('medicineChart');
        if (!ctx) return;

        const medicineData = this.getMedicineSummary();
        
        if (window.medicineChart && typeof window.medicineChart.destroy === 'function') {
            window.medicineChart.destroy();
        }

        window.medicineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(medicineData),
                datasets: [{
                    label: 'Stock Level',
                    data: Object.values(medicineData).map(m => m.stock),
                    backgroundColor: Object.values(medicineData).map(m => this.getMedicineColor(m.status)),
                    borderColor: Object.values(medicineData).map(m => this.getMedicineBorderColor(m.status)),
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

    // Get medicine summary across all hospitals
    getMedicineSummary() {
        const summary = {};
        this.hospitals.forEach(hospital => {
            Object.keys(hospital.medicines).forEach(medicine => {
                if (!summary[medicine]) {
                    summary[medicine] = { stock: 0, required: 0, status: 'sufficient' };
                }
                summary[medicine].stock += hospital.medicines[medicine].stock;
                summary[medicine].required += hospital.medicines[medicine].required;
            });
        });
        return summary;
    }

    // Get medicine color based on status
    getMedicineColor(status) {
        const colors = {
            'sufficient': '#28a745',
            'low': '#ffc107',
            'critical': '#dc3545'
        };
        return colors[status] || '#6c757d';
    }

    // Get medicine border color
    getMedicineBorderColor(status) {
        const colors = {
            'sufficient': '#1e7e34',
            'low': '#e0a800',
            'critical': '#bd2130'
        };
        return colors[status] || '#495057';
    }

    // Update hospital list
    updateHospitalList() {
        const hospitalList = document.getElementById('hospitalList');
        if (!hospitalList) return;

        hospitalList.innerHTML = '';
        this.hospitals.forEach(hospital => {
            const hospitalDiv = document.createElement('div');
            hospitalDiv.className = 'hospital-item mb-3 p-3 border rounded';
            hospitalDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${hospital.name}</h6>
                        <small class="text-muted">${hospital.ward}</small>
                        <div class="mt-2">
                            <div class="row">
                                <div class="col-6">
                                    <small><strong>Beds:</strong> ${hospital.availableBeds}/${hospital.totalBeds}</small><br>
                                    <small><strong>ICU:</strong> ${hospital.availableIcu}/${hospital.icuBeds}</small>
                                </div>
                                <div class="col-6">
                                    <small><strong>Ventilators:</strong> ${hospital.availableVentilators}/${hospital.ventilators}</small><br>
                                    <small><strong>Status:</strong> <span class="badge bg-${this.getHospitalStatusColor(hospital)}">${this.getHospitalStatus(hospital)}</span></small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ms-3">
                        <button class="btn btn-sm btn-outline-primary" onclick="openHospitalUpdate(${hospital.id})">
                            <i class="fas fa-edit"></i> Update
                        </button>
                    </div>
                </div>
            `;
            hospitalList.appendChild(hospitalDiv);
        });
    }

    // Get hospital status
    getHospitalStatus(hospital) {
        const occupancyRate = (hospital.occupiedBeds / hospital.totalBeds) * 100;
        if (occupancyRate >= 90) return 'Critical';
        if (occupancyRate >= 75) return 'High';
        if (occupancyRate >= 50) return 'Medium';
        return 'Low';
    }

    // Get hospital status color
    getHospitalStatusColor(hospital) {
        const occupancyRate = (hospital.occupiedBeds / hospital.totalBeds) * 100;
        if (occupancyRate >= 90) return 'danger';
        if (occupancyRate >= 75) return 'warning';
        if (occupancyRate >= 50) return 'info';
        return 'success';
    }

    // Setup event listeners
    setupEventListeners() {
        // Hospital update form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'hospitalUpdateForm') {
                e.preventDefault();
                this.updateHospitalResource(e);
            }
        });
    }

    // Update hospital resource
    updateHospitalResource(event) {
        const formData = new FormData(event.target);
        const hospitalId = parseInt(formData.get('hospitalId'));
        const occupiedBeds = parseInt(formData.get('occupiedBeds'));
        const occupiedIcu = parseInt(formData.get('occupiedIcu'));
        const availableVentilators = parseInt(formData.get('availableVentilators'));

        const hospital = this.hospitals.find(h => h.id === hospitalId);
        if (hospital) {
            hospital.occupiedBeds = occupiedBeds;
            hospital.availableBeds = hospital.totalBeds - occupiedBeds;
            hospital.occupiedIcu = occupiedIcu;
            hospital.availableIcu = hospital.icuBeds - occupiedIcu;
            hospital.availableVentilators = availableVentilators;
            hospital.lastUpdate = new Date();

            this.updateHospitalCharts();
            this.updateHospitalList();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('hospitalUpdateModal'));
            modal.hide();
            
            showNotification('success', `Hospital resources updated for ${hospital.name}`);
        }
    }

    // Get hospital by ID
    getHospitalById(id) {
        return this.hospitals.find(h => h.id === id);
    }

    // Get all hospitals
    getHospitals() {
        return this.hospitals;
    }
}

// Global hospital manager instance
window.hospitalManager = new HospitalManager();

// Function to open hospital update modal
window.openHospitalUpdate = function(hospitalId) {
    const hospital = window.hospitalManager.getHospitalById(hospitalId);
    if (!hospital) return;

    // Populate form
    document.getElementById('hospitalUpdateId').value = hospital.id;
    document.getElementById('hospitalUpdateName').textContent = hospital.name;
    document.getElementById('hospitalUpdateWard').textContent = hospital.ward;
    document.getElementById('hospitalUpdateOccupiedBeds').value = hospital.occupiedBeds;
    document.getElementById('hospitalUpdateOccupiedIcu').value = hospital.occupiedIcu;
    document.getElementById('hospitalUpdateAvailableVentilators').value = hospital.availableVentilators;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('hospitalUpdateModal'));
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