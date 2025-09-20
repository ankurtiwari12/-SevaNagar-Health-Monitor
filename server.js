// SevaNagar Health Monitoring Dashboard - Backend Server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database('sevanagar_health.db');

// Create tables
db.serialize(() => {
    // Cases table
    db.run(`CREATE TABLE IF NOT EXISTS cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward TEXT NOT NULL,
        disease TEXT NOT NULL,
        new_cases INTEGER NOT NULL,
        total_cases INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Hospitals table
    db.run(`CREATE TABLE IF NOT EXISTS hospitals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ward TEXT NOT NULL,
        total_beds INTEGER NOT NULL,
        occupied_beds INTEGER NOT NULL,
        icu_beds INTEGER NOT NULL,
        ventilators INTEGER NOT NULL,
        latitude REAL,
        longitude REAL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Vaccination table
    db.run(`CREATE TABLE IF NOT EXISTS vaccinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward TEXT NOT NULL,
        total_population INTEGER NOT NULL,
        vaccinated INTEGER NOT NULL,
        vaccination_rate REAL NOT NULL,
        last_campaign DATE,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Alerts table
    db.run(`CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        ward TEXT,
        severity TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
    )`);

    // Insert sample data
    insertSampleData();
});

// Insert sample data
function insertSampleData() {
    // Sample cases data
    const casesData = [
        ['Ward-1', 'Dengue', 12, 45, 'high'],
        ['Ward-2', 'Flu', 8, 32, 'medium'],
        ['Ward-3', 'Dengue', 15, 67, 'critical'],
        ['Ward-4', 'COVID-19', 3, 18, 'low'],
        ['Ward-5', 'Malaria', 6, 38, 'medium']
    ];

    casesData.forEach(data => {
        db.run(`INSERT OR IGNORE INTO cases (ward, disease, new_cases, total_cases, status) 
                VALUES (?, ?, ?, ?, ?)`, data);
    });

    // Sample hospital data
    const hospitalsData = [
        ['SevaNagar General Hospital', 'Ward-1', 100, 65, 20, 15, 12.9716, 77.5946],
        ['City Medical Center', 'Ward-2', 80, 45, 15, 12, 12.9352, 77.6245],
        ['Emergency Care Hospital', 'Ward-3', 120, 90, 25, 20, 12.9239, 77.5937],
        ['Community Health Center', 'Ward-4', 60, 30, 10, 8, 12.9147, 77.6120],
        ['Rural Medical Center', 'Ward-5', 70, 40, 12, 10, 12.9048, 77.6340]
    ];

    hospitalsData.forEach(data => {
        db.run(`INSERT OR IGNORE INTO hospitals (name, ward, total_beds, occupied_beds, icu_beds, ventilators, latitude, longitude) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, data);
    });

    // Sample vaccination data
    const vaccinationData = [
        ['Ward-1', 50000, 42500, 85.0, '2024-01-15'],
        ['Ward-2', 45000, 32400, 72.0, '2024-01-10'],
        ['Ward-3', 55000, 50050, 91.0, '2024-01-20'],
        ['Ward-4', 40000, 27200, 68.0, '2024-01-05'],
        ['Ward-5', 48000, 37440, 78.0, '2024-01-12']
    ];

    vaccinationData.forEach(data => {
        db.run(`INSERT OR IGNORE INTO vaccinations (ward, total_population, vaccinated, vaccination_rate, last_campaign) 
                VALUES (?, ?, ?, ?, ?)`, data);
    });

    // Sample alerts
    const alertsData = [
        ['warning', 'Dengue outbreak detected in Ward-3', 'Ward-3', 'high'],
        ['info', 'Vaccination drive scheduled for Ward-4', 'Ward-4', 'medium'],
        ['success', 'Ward-1 vaccination target achieved', 'Ward-1', 'low']
    ];

    alertsData.forEach(data => {
        db.run(`INSERT OR IGNORE INTO alerts (type, message, ward, severity) 
                VALUES (?, ?, ?, ?)`, data);
    });
}

// WebSocket server for real-time updates
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected. Total clients:', clients.size);

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected. Total clients:', clients.size);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Broadcast data to all connected clients
function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// API Routes

// Get all cases
app.get('/api/cases', (req, res) => {
    db.all('SELECT * FROM cases ORDER BY updated_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add new case
app.post('/api/cases', (req, res) => {
    const { ward, disease, newCases, totalCases, status } = req.body;
    
    db.run(
        'INSERT INTO cases (ward, disease, new_cases, total_cases, status) VALUES (?, ?, ?, ?, ?)',
        [ward, disease, newCases, totalCases, status],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Broadcast update to all clients
            broadcast({
                type: 'case_update',
                data: { id: this.lastID, ward, disease, newCases, totalCases, status }
            });
            
            res.json({ id: this.lastID, message: 'Case added successfully' });
        }
    );
});

// Update case
app.put('/api/cases/:id', (req, res) => {
    const { id } = req.params;
    const { ward, disease, newCases, totalCases, status } = req.body;
    
    db.run(
        'UPDATE cases SET ward = ?, disease = ?, new_cases = ?, total_cases = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [ward, disease, newCases, totalCases, status, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Broadcast update to all clients
            broadcast({
                type: 'case_update',
                data: { id, ward, disease, newCases, totalCases, status }
            });
            
            res.json({ message: 'Case updated successfully' });
        }
    );
});

// Get hospital data
app.get('/api/hospitals', (req, res) => {
    db.all('SELECT * FROM hospitals ORDER BY name', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Update hospital resources
app.put('/api/hospitals/:id', (req, res) => {
    const { id } = req.params;
    const { occupied_beds, icu_beds, ventilators } = req.body;
    
    db.run(
        'UPDATE hospitals SET occupied_beds = ?, icu_beds = ?, ventilators = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [occupied_beds, icu_beds, ventilators, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Broadcast update to all clients
            broadcast({
                type: 'hospital_update',
                data: { id, occupied_beds, icu_beds, ventilators }
            });
            
            res.json({ message: 'Hospital data updated successfully' });
        }
    );
});

// Get vaccination data
app.get('/api/vaccinations', (req, res) => {
    db.all('SELECT * FROM vaccinations ORDER BY ward', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Update vaccination data
app.put('/api/vaccinations/:ward', (req, res) => {
    const { ward } = req.params;
    const { vaccinated, vaccination_rate } = req.body;
    
    db.run(
        'UPDATE vaccinations SET vaccinated = ?, vaccination_rate = ?, updated_at = CURRENT_TIMESTAMP WHERE ward = ?',
        [vaccinated, vaccination_rate, ward],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Broadcast update to all clients
            broadcast({
                type: 'vaccination_update',
                data: { ward, vaccinated, vaccination_rate }
            });
            
            res.json({ message: 'Vaccination data updated successfully' });
        }
    );
});

// Get alerts
app.get('/api/alerts', (req, res) => {
    db.all('SELECT * FROM alerts WHERE is_active = 1 ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add new alert
app.post('/api/alerts', (req, res) => {
    const { type, message, ward, severity } = req.body;
    
    db.run(
        'INSERT INTO alerts (type, message, ward, severity) VALUES (?, ?, ?, ?)',
        [type, message, ward, severity],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Broadcast alert to all clients
            broadcast({
                type: 'new_alert',
                data: { id: this.lastID, type, message, ward, severity }
            });
            
            res.json({ id: this.lastID, message: 'Alert created successfully' });
        }
    );
});

// Get dashboard statistics
app.get('/api/stats', (req, res) => {
    const stats = {};
    
    // Get total cases
    db.get('SELECT SUM(total_cases) as total FROM cases', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        stats.totalCases = row.total || 0;
        
        // Get available beds
        db.get('SELECT SUM(total_beds - occupied_beds) as available FROM hospitals', (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            stats.availableBeds = row.available || 0;
            
            // Get average vaccination rate
            db.get('SELECT AVG(vaccination_rate) as avg_rate FROM vaccinations', (err, row) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                stats.avgVaccinationRate = Math.round(row.avg_rate || 0);
                
                // Get active alerts count
                db.get('SELECT COUNT(*) as count FROM alerts WHERE is_active = 1', (err, row) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    stats.activeAlerts = row.count || 0;
                    
                    res.json(stats);
                });
            });
        });
    });
});

// Get heatmap data
app.get('/api/heatmap', (req, res) => {
    db.all(`
        SELECT c.ward, c.disease, c.total_cases, c.status, h.latitude, h.longitude
        FROM cases c
        LEFT JOIN hospitals h ON c.ward = h.ward
        ORDER BY c.total_cases DESC
    `, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Simulate real-time data updates
setInterval(() => {
    // Randomly update some case data
    if (Math.random() > 0.8) {
        db.get('SELECT * FROM cases ORDER BY RANDOM() LIMIT 1', (err, row) => {
            if (row) {
                const newCases = Math.floor(Math.random() * 3);
                const totalCases = row.total_cases + newCases;
                const status = getStatusFromCases(totalCases);
                
                db.run(
                    'UPDATE cases SET new_cases = ?, total_cases = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [newCases, totalCases, status, row.id],
                    function(err) {
                        if (!err) {
                            // Broadcast update
                            broadcast({
                                type: 'case_update',
                                data: {
                                    id: row.id,
                                    ward: row.ward,
                                    disease: row.disease,
                                    newCases,
                                    totalCases,
                                    status
                                }
                            });
                        }
                    }
                );
            }
        });
    }
}, 30000); // Update every 30 seconds

// Helper function to determine status based on case count
function getStatusFromCases(cases) {
    if (cases >= 60) return 'critical';
    if (cases >= 40) return 'high';
    if (cases >= 20) return 'medium';
    return 'low';
}

// Start server
server.listen(PORT, () => {
    console.log(`SevaNagar Health Dashboard Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to view the dashboard`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});