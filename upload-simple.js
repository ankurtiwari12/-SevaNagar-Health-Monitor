// Simple upload functionality for SevaNagar Health Dashboard

// Global function for uploading data
window.uploadData = function() {
    // Get form values
    const ward = document.getElementById('wardSelect').value;
    const disease = document.getElementById('diseaseSelect').value;
    const newCases = parseInt(document.getElementById('newCases').value);
    const totalActiveCases = parseInt(document.getElementById('totalActiveCases').value);
    
    // Validate form
    if (!ward || !disease || isNaN(newCases) || isNaN(totalActiveCases)) {
        showNotification('error', 'Please fill in all fields');
        return;
    }
    
    if (newCases < 0 || totalActiveCases < 0) {
        showNotification('error', 'Case numbers cannot be negative');
        return;
    }
    
    // Create new case data
    const newCaseData = {
        ward: ward,
        disease: disease,
        newCases: newCases,
        totalCases: totalActiveCases,
        status: getStatusFromCases(totalActiveCases),
        lastUpdated: new Date()
    };
    
    // Add to case data (if dashboard exists)
    if (window.dashboard && window.dashboard.data) {
        // Check if ward already exists for this disease
        const existingIndex = window.dashboard.data.cases.findIndex(item => 
            item.ward === ward && item.disease === disease
        );
        
        if (existingIndex >= 0) {
            window.dashboard.data.cases[existingIndex] = newCaseData;
        } else {
            window.dashboard.data.cases.unshift(newCaseData);
        }
        
        // Recalculate stats
        if (window.dashboard.calculateStats) {
            window.dashboard.calculateStats();
        }
        
        // Update dashboard
        if (window.dashboard.updateDashboard) {
            window.dashboard.updateDashboard();
        } else {
            // Fallback methods
            if (window.dashboard.updateCaseTable) window.dashboard.updateCaseTable();
            if (window.dashboard.updateStats) window.dashboard.updateStats();
            if (window.dashboard.updateHeatmap) window.dashboard.updateHeatmap();
        }
    } else {
        // Fallback: update the table directly
        updateCaseTableDirectly(newCaseData);
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('dataUploadModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('dataUploadForm').reset();
    
    // Update heatmap
    if (window.updateHeatmapData) {
        window.updateHeatmapData(ward, disease, newCases, totalActiveCases);
    }
    
    // Show success message
    showNotification('success', `Data uploaded successfully for ${ward} - ${disease}`);
    
    // Update statistics
    updateStatsDirectly();
}

// Get status based on case count
function getStatusFromCases(cases) {
    if (cases >= 60) return 'critical';
    if (cases >= 40) return 'high';
    if (cases >= 20) return 'medium';
    return 'low';
}

// Update case table directly (fallback method)
function updateCaseTableDirectly(newCaseData) {
    const tbody = document.getElementById('caseDataTable');
    if (!tbody) return;
    
    // Check if row already exists
    const existingRows = tbody.querySelectorAll('tr');
    let existingRow = null;
    
    existingRows.forEach(row => {
        const wardCell = row.cells[0];
        const diseaseCell = row.cells[1];
        if (wardCell && diseaseCell && 
            wardCell.textContent === newCaseData.ward && 
            diseaseCell.textContent === newCaseData.disease) {
            existingRow = row;
        }
    });
    
    if (existingRow) {
        // Update existing row
        existingRow.cells[2].textContent = newCaseData.newCases;
        existingRow.cells[3].textContent = newCaseData.totalCases;
        existingRow.cells[4].innerHTML = `<span class="status-badge status-${newCaseData.status}">${newCaseData.status}</span>`;
        existingRow.cells[5].textContent = formatTime(newCaseData.lastUpdated);
    } else {
        // Add new row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${newCaseData.ward}</td>
            <td>${newCaseData.disease}</td>
            <td>${newCaseData.newCases}</td>
            <td>${newCaseData.totalCases}</td>
            <td><span class="status-badge status-${newCaseData.status}">${newCaseData.status}</span></td>
            <td>${formatTime(newCaseData.lastUpdated)}</td>
        `;
        tbody.insertBefore(row, tbody.firstChild);
    }
}

// Update statistics directly (fallback method)
function updateStatsDirectly() {
    const tbody = document.getElementById('caseDataTable');
    if (!tbody) return;
    
    let totalCases = 0;
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const totalCasesCell = row.cells[3];
        if (totalCasesCell) {
            totalCases += parseInt(totalCasesCell.textContent) || 0;
        }
    });
    
    // Update the total cases display
    const totalCasesElement = document.getElementById('totalCases');
    if (totalCasesElement) {
        totalCasesElement.textContent = totalCases;
    }
}

// Format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Show notification
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

// Global function for opening data upload
window.openDataUpload = function() {
    const modal = new bootstrap.Modal(document.getElementById('dataUploadModal'));
    modal.show();
}

// Global function for opening citizen portal
window.openCitizenPortal = function() {
    const modal = new bootstrap.Modal(document.getElementById('citizenPortalModal'));
    modal.show();
}