# SevaNagar Health Monitoring Dashboard

A comprehensive real-time health monitoring system designed to transform SevaNagar from a reactive city to a proactive health-secure city. This dashboard provides early warning systems, resource management, and citizen engagement tools to prevent health crises before they escalate.

## 🏥 Features

### Real-time Disease Tracking
- **Outbreak Heatmap**: Visual representation of disease hotspots across wards
- **Early Warning System**: Automated alerts when case thresholds are exceeded
- **Multi-disease Support**: Track dengue, flu, COVID-19, malaria, and other diseases

### Hospital Resource Management
- **Live Bed Tracking**: Real-time availability of hospital beds, ICU beds, and ventilators
- **Resource Allocation**: Optimize resource distribution across hospitals
- **Capacity Monitoring**: Track hospital occupancy rates and capacity

### Vaccination Coverage
- **Ward-level Tracking**: Monitor vaccination rates by district/ward
- **Coverage Visualization**: Charts showing vaccination progress
- **Target Identification**: Identify areas with low vaccination rates

### Citizen Portal
- **Health Alerts**: Real-time notifications for citizens
- **Prevention Tips**: Educational content and health advisories
- **Public Information**: Access to health statistics and updates

### Data Management
- **Clinic Integration**: Upload system for clinics and pharmacies
- **Real-time Updates**: WebSocket-based live data synchronization
- **Data Persistence**: SQLite database for reliable data storage

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd sevanagar-health-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open the dashboard**
   - Open your browser and go to `http://localhost:3000`
   - The dashboard will load with sample data

### Alternative Setup (Windows)
```bash
# Run the setup script
npm run setup
```

## 📊 Dashboard Components

### Main Dashboard
- **Quick Stats**: Active cases, available beds, vaccination rate, active alerts
- **Disease Heatmap**: Interactive map showing outbreak locations
- **Hospital Resources**: Doughnut chart of bed availability
- **Vaccination Coverage**: Bar chart of ward-wise vaccination rates
- **Real-time Data Table**: Live case data with status indicators

### Data Upload System
- **Clinic Interface**: Upload daily case counts
- **Ward Selection**: Choose from 5 wards (Ward-1 to Ward-5)
- **Disease Types**: Support for multiple disease categories
- **Real-time Processing**: Immediate data integration

### Citizen Portal
- **Health Alerts**: Current health advisories and warnings
- **Prevention Tips**: Educational content for disease prevention
- **Public Statistics**: Access to health data and trends

## 🔧 Technical Architecture

### Frontend
- **HTML5/CSS3**: Modern responsive design
- **JavaScript (ES6+)**: Interactive functionality
- **Leaflet Maps**: Interactive mapping and heatmap visualization
- **Chart.js**: Data visualization and charts
- **Bootstrap 5**: Responsive UI framework

### Backend
- **Node.js/Express**: RESTful API server
- **SQLite3**: Lightweight database for data persistence
- **WebSocket**: Real-time data synchronization
- **CORS**: Cross-origin resource sharing

### Database Schema
- **Cases Table**: Disease case tracking
- **Hospitals Table**: Hospital resource management
- **Vaccinations Table**: Vaccination coverage data
- **Alerts Table**: System alerts and notifications

## 📱 Usage Guide

### For Health Officials
1. **Monitor Dashboard**: Check real-time statistics and alerts
2. **Upload Data**: Use the floating action button to upload case data
3. **Track Resources**: Monitor hospital bed availability and resource allocation
4. **Manage Alerts**: View and respond to outbreak alerts

### For Citizens
1. **Access Portal**: Click the citizen portal button
2. **View Alerts**: Check for health advisories in your area
3. **Prevention Tips**: Access educational content and prevention guidelines
4. **Stay Informed**: Monitor health statistics and trends

### For Clinics/Pharmacies
1. **Data Upload**: Use the upload form to submit daily case counts
2. **Select Ward**: Choose the appropriate ward for your location
3. **Enter Data**: Input new cases and total active cases
4. **Submit**: Data is immediately integrated into the system

## 🚨 Early Warning System

The dashboard includes an intelligent early warning system that:
- **Monitors Thresholds**: Tracks case counts against predefined thresholds
- **Generates Alerts**: Automatically creates alerts for high-risk situations
- **Risk Assessment**: Categorizes risk levels (Low, Medium, High, Critical)
- **Real-time Notifications**: Immediate alerts via WebSocket connections

### Risk Levels
- **Low**: 0-19 cases (Green)
- **Medium**: 20-39 cases (Yellow)
- **High**: 40-59 cases (Orange)
- **Critical**: 60+ cases (Red, with pulsing animation)

## 🔄 Real-time Features

### Live Data Updates
- **WebSocket Connection**: Maintains persistent connection for real-time updates
- **Auto-refresh**: Dashboard updates every 30 seconds
- **Instant Notifications**: Immediate alerts for critical situations
- **Data Synchronization**: All connected clients receive updates simultaneously

### Data Sources
- **Clinic Uploads**: Manual data entry from healthcare facilities
- **Simulated Updates**: Automatic simulation of case progression
- **API Integration**: RESTful API for external data sources
- **Database Triggers**: Automated data processing and analysis

## 🛠️ Customization

### Adding New Diseases
1. Update the disease options in the upload form
2. Add disease-specific thresholds in the warning system
3. Customize visualization colors and icons

### Modifying Wards
1. Update ward lists in the database
2. Add new coordinates for heatmap visualization
3. Update vaccination tracking for new areas

### Alert Configuration
1. Modify threshold values in the server code
2. Customize alert messages and severity levels
3. Add new alert types and notification methods

## 📈 Future Enhancements

### Planned Features
- **Mobile App**: Native mobile application for field workers
- **AI Integration**: Machine learning for outbreak prediction
- **SMS Alerts**: Text message notifications for citizens
- **Integration APIs**: Connect with existing health systems
- **Advanced Analytics**: Predictive modeling and trend analysis

### Scalability
- **Database Migration**: Support for PostgreSQL/MySQL
- **Load Balancing**: Multiple server instances
- **Caching**: Redis integration for improved performance
- **CDN**: Content delivery network for global access

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Use ES6+ JavaScript features
- Follow consistent naming conventions
- Add comments for complex logic
- Test all new features

## 📞 Support

For technical support or questions:
- **Email**: health@sevanagar.gov.in
- **Phone**: +91-XXX-XXXX-XXXX
- **Documentation**: [Link to detailed docs]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **SevaNagar Health Department**: For requirements and testing
- **Open Source Community**: For excellent libraries and tools
- **Healthcare Workers**: For their dedication and feedback

---

**SevaNagar Health Dashboard** - Transforming reactive healthcare into proactive health security.

*Built with ❤️ for the health and safety of SevaNagar residents*