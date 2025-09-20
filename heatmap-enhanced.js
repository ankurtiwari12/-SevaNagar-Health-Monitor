// Enhanced Heatmap functionality for SevaNagar Health Dashboard

class HeatmapManager {
    constructor() {
        this.map = null;
        this.heatmapLayer = null;
        this.wardData = [];
        this.initializeWardData();
    }

    // Initialize ward data with coordinates and sample data
    initializeWardData() {
        this.wardData = [
            {
                ward: 'Ward-1',
                name: 'Central Business District',
                lat: 12.9716,
                lng: 77.5946,
                population: 50000,
                cases: 45,
                disease: 'Dengue',
                riskLevel: 'high',
                lastUpdate: new Date()
            },
            {
                ward: 'Ward-2',
                name: 'Residential North',
                lat: 12.9352,
                lng: 77.6245,
                population: 45000,
                cases: 32,
                disease: 'Flu',
                riskLevel: 'medium',
                lastUpdate: new Date()
            },
            {
                ward: 'Ward-3',
                name: 'Industrial Zone',
                lat: 12.9239,
                lng: 77.5937,
                population: 55000,
                cases: 67,
                disease: 'Dengue',
                riskLevel: 'critical',
                lastUpdate: new Date()
            },
            {
                ward: 'Ward-4',
                name: 'Suburban East',
                lat: 12.9147,
                lng: 77.6120,
                population: 40000,
                cases: 18,
                disease: 'COVID-19',
                riskLevel: 'low',
                lastUpdate: new Date()
            },
            {
                ward: 'Ward-5',
                name: 'Rural South',
                lat: 12.9048,
                lng: 77.6340,
                population: 48000,
                cases: 38,
                disease: 'Malaria',
                riskLevel: 'medium',
                lastUpdate: new Date()
            }
        ];
    }

    // Initialize the heatmap
    initializeHeatmap(containerId) {
        // Create map
        this.map = L.map(containerId).setView([12.9716, 77.5946], 11);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add ward boundaries
        this.addWardBoundaries();
        
        // Add heatmap overlay
        this.addHeatmapOverlay();
        
        // Add markers
        this.addWardMarkers();
        
        // Add legend
        this.addHeatmapLegend();
        
        // Add ward labels
        this.addWardLabels();
    }

    // Add ward boundaries (simplified polygons)
    addWardBoundaries() {
        const wardBoundaries = [
            {
                ward: 'Ward-1',
                coords: [
                    [12.9800, 77.5800],
                    [12.9800, 77.6100],
                    [12.9600, 77.6100],
                    [12.9600, 77.5800],
                    [12.9800, 77.5800]
                ]
            },
            {
                ward: 'Ward-2',
                coords: [
                    [12.9500, 77.6100],
                    [12.9500, 77.6400],
                    [12.9200, 77.6400],
                    [12.9200, 77.6100],
                    [12.9500, 77.6100]
                ]
            },
            {
                ward: 'Ward-3',
                coords: [
                    [12.9400, 77.5800],
                    [12.9400, 77.6100],
                    [12.9100, 77.6100],
                    [12.9100, 77.5800],
                    [12.9400, 77.5800]
                ]
            },
            {
                ward: 'Ward-4',
                coords: [
                    [12.9300, 77.6000],
                    [12.9300, 77.6300],
                    [12.9000, 77.6300],
                    [12.9000, 77.6000],
                    [12.9300, 77.6000]
                ]
            },
            {
                ward: 'Ward-5',
                coords: [
                    [12.9200, 77.6200],
                    [12.9200, 77.6500],
                    [12.8900, 77.6500],
                    [12.8900, 77.6200],
                    [12.9200, 77.6200]
                ]
            }
        ];

        wardBoundaries.forEach(boundary => {
            const ward = this.wardData.find(w => w.ward === boundary.ward);
            const color = this.getRiskColor(ward ? ward.riskLevel : 'low');
            
            L.polygon(boundary.coords, {
                color: color,
                weight: 2,
                fillColor: color,
                fillOpacity: 0.3
            }).addTo(this.map).bindPopup(`
                <strong>${boundary.ward}</strong><br>
                ${ward ? ward.name : 'Unknown Ward'}<br>
                Cases: ${ward ? ward.cases : 0}<br>
                Risk: ${ward ? ward.riskLevel.toUpperCase() : 'LOW'}
            `);
        });
    }

    // Add heatmap overlay using circles
    addHeatmapOverlay() {
        this.wardData.forEach(ward => {
            const intensity = this.calculateIntensity(ward.cases, ward.population);
            const color = this.getRiskColor(ward.riskLevel);
            const radius = this.calculateRadius(ward.cases);
            
            // Create heatmap circle
            const circle = L.circle([ward.lat, ward.lng], {
                color: color,
                fillColor: color,
                fillOpacity: intensity,
                radius: radius,
                weight: 2
            }).addTo(this.map);
            
            // Add hover effect
            circle.on('mouseover', function(e) {
                this.setStyle({
                    weight: 4,
                    fillOpacity: 0.8
                });
            });
            
            circle.on('mouseout', function(e) {
                this.setStyle({
                    weight: 2,
                    fillOpacity: intensity
                });
            });
        });
    }

    // Add ward markers with icons
    addWardMarkers() {
        this.wardData.forEach(ward => {
            const icon = this.createWardIcon(ward.riskLevel);
            
            L.marker([ward.lat, ward.lng], { icon: icon })
                .addTo(this.map)
                .bindPopup(`
                    <div class="ward-popup">
                        <h6><strong>${ward.ward}</strong></h6>
                        <p><strong>${ward.name}</strong></p>
                        <p><strong>Disease:</strong> ${ward.disease}</p>
                        <p><strong>Active Cases:</strong> ${ward.cases}</p>
                        <p><strong>Population:</strong> ${ward.population.toLocaleString()}</p>
                        <p><strong>Risk Level:</strong> <span class="badge bg-${this.getBootstrapColor(ward.riskLevel)}">${ward.riskLevel.toUpperCase()}</span></p>
                        <p><strong>Last Update:</strong> ${ward.lastUpdate.toLocaleString()}</p>
                    </div>
                `);
        });
    }

    // Create ward icon based on risk level
    createWardIcon(riskLevel) {
        const colors = {
            'critical': '#d32f2f',
            'high': '#f57c00',
            'medium': '#ffc107',
            'low': '#4caf50'
        };
        
        const color = colors[riskLevel] || '#4caf50';
        
        return L.divIcon({
            className: 'ward-marker',
            html: `<div style="
                background-color: ${color};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }

    // Add ward labels
    addWardLabels() {
        this.wardData.forEach(ward => {
            L.marker([ward.lat, ward.lng], {
                icon: L.divIcon({
                    className: 'ward-label',
                    html: `<div style="
                        background-color: rgba(255,255,255,0.9);
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-weight: bold;
                        font-size: 12px;
                        border: 1px solid #ccc;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    ">${ward.ward}</div>`,
                    iconSize: [60, 20],
                    iconAnchor: [30, 10]
                })
            }).addTo(this.map);
        });
    }

    // Add heatmap legend
    addHeatmapLegend() {
        const legend = L.control({position: 'bottomright'});
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'heatmap-legend');
            div.innerHTML = `
                <div class="legend-header">
                    <h6><i class="fas fa-map-marked-alt me-2"></i>Risk Level</h6>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #d32f2f;"></div>
                    <span>Critical (60+ cases)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #f57c00;"></div>
                    <span>High (40-59 cases)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #ffc107;"></div>
                    <span>Medium (20-39 cases)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #4caf50;"></div>
                    <span>Low (0-19 cases)</span>
                </div>
                <div class="legend-separator"></div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #e0e0e0; border: 1px solid #999;"></div>
                    <span>Ward Boundaries</span>
                </div>
            `;
            return div;
        };
        legend.addTo(this.map);
    }

    // Calculate intensity based on cases and population
    calculateIntensity(cases, population) {
        const caseRate = (cases / population) * 1000; // cases per 1000 people
        if (caseRate >= 2) return 0.8;
        if (caseRate >= 1) return 0.6;
        if (caseRate >= 0.5) return 0.4;
        return 0.2;
    }

    // Calculate radius based on case count
    calculateRadius(cases) {
        return Math.max(100, Math.min(500, cases * 8));
    }

    // Get risk color
    getRiskColor(riskLevel) {
        const colors = {
            'critical': '#d32f2f',
            'high': '#f57c00',
            'medium': '#ffc107',
            'low': '#4caf50'
        };
        return colors[riskLevel] || '#4caf50';
    }

    // Get Bootstrap color class
    getBootstrapColor(riskLevel) {
        const colors = {
            'critical': 'danger',
            'high': 'warning',
            'medium': 'info',
            'low': 'success'
        };
        return colors[riskLevel] || 'success';
    }

    // Update ward data
    updateWardData(ward, disease, newCases, totalCases) {
        const wardIndex = this.wardData.findIndex(w => w.ward === ward);
        if (wardIndex >= 0) {
            this.wardData[wardIndex].cases = totalCases;
            this.wardData[wardIndex].disease = disease;
            this.wardData[wardIndex].riskLevel = this.getRiskLevelFromCases(totalCases);
            this.wardData[wardIndex].lastUpdate = new Date();
            
            // Refresh the map
            this.refreshMap();
        }
    }

    // Get risk level from case count
    getRiskLevelFromCases(cases) {
        if (cases >= 60) return 'critical';
        if (cases >= 40) return 'high';
        if (cases >= 20) return 'medium';
        return 'low';
    }

    // Refresh the entire map
    refreshMap() {
        // Clear existing layers
        this.map.eachLayer(layer => {
            if (layer instanceof L.Circle || layer instanceof L.Polygon || 
                layer instanceof L.Marker) {
                this.map.removeLayer(layer);
            }
        });
        
        // Re-add all elements
        this.addWardBoundaries();
        this.addHeatmapOverlay();
        this.addWardMarkers();
        this.addWardLabels();
    }

    // Get current ward data
    getWardData() {
        return this.wardData;
    }
}

// Global heatmap manager instance
window.heatmapManager = new HeatmapManager();

// Initialize heatmap when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize main dashboard heatmap
    if (document.getElementById('heatmap')) {
        window.heatmapManager.initializeHeatmap('heatmap');
    }
    
    // Initialize outbreaks section heatmap
    if (document.getElementById('outbreakHeatmap')) {
        window.heatmapManager.initializeHeatmap('outbreakHeatmap');
    }
});

// Function to update heatmap from external sources
window.updateHeatmapData = function(ward, disease, newCases, totalCases) {
    if (window.heatmapManager) {
        window.heatmapManager.updateWardData(ward, disease, newCases, totalCases);
    }
};