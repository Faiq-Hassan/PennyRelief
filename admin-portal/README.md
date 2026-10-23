# PennyRelief - Admin Portal

## Overview
The PennyRelief Admin Portal is a comprehensive web-based administrative interface for managing the PennyRelief Student Micro-Donation & Relief Bank system. This dashboard enables administrators to oversee student loans, track donations, manage users, and monitor all banking activities.

## 🎯 Key Features

### User Management
- View and manage student profiles
- Track user verification status
- Export user data in PDF/Excel formats
- Block/Unblock user accounts
- View user profile images and documents

### Loan Management
- Review loan applications
- Approve/Reject loan requests
- Track loan disbursement
- Monitor EMI payments
- Generate loan reports
- View loan statistics

### Donation Tracking
- Monitor all donations
- View donation statistics
- Generate donation reports
- Track donor information
- Export donation data

### Analytics Dashboard
- Real-time statistics
- User growth metrics
- Loan approval rates
- Donation trends
- Department-wise analytics

## 💻 Technology Stack

- **Frontend Framework**: React.js + Vite
- **State Management**: Redux Toolkit
- **UI Library**: Tailwind CSS
- **Charts**: Chart.js
- **Data Tables**: React Table
- **API Integration**: Axios
- **PDF Generation**: jsPDF
- **Excel Export**: XLSX

## 📁 Project Structure

```
admin-portal/
├── src/                    # Source files
│   ├── pages/             # Page components
│   │   ├── Dashboard/     # Dashboard views
│   │   ├── Users/         # User management
│   │   ├── Loans/        # Loan management
│   │   └── Donations/    # Donation tracking
│   ├── components/        # Reusable components
│   │   ├── Tables/       # Table components
│   │   ├── Charts/       # Analytics charts
│   │   └── UI/           # UI elements
│   ├── redux/            # State management
│   │   ├── store.js      # Redux store
│   │   └── slices/       # Redux slices
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   └── constants/        # Constants and configs
├── public/               # Public assets
└── vite.config.js       # Vite configuration
```

## 🔐 Admin Features

### 1. Dashboard
- Overview statistics
- Quick action buttons
- Recent activities
- System notifications
- Performance metrics

### 2. User Management
- User listing with filters
- Detailed user profiles
- Document verification
- Account status management
- User data export

### 3. Loan Management
- Loan application review
- Document verification
- Approval workflow
- Payment tracking
- Default monitoring

### 4. Donation Management
- Donation tracking
- Donor management
- Payment verification
- Receipt generation
- Statistical analysis

## ⚙️ Installation & Setup

1. **Prerequisites**
   ```bash
   Node.js >= 16.x
   npm or yarn
   Git
   ```

2. **Clone & Install**
   ```bash
   # Clone repository
   git clone [repository-url]

   # Navigate to directory
   cd admin-portal

   # Install dependencies
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp .env.example .env

   # Configure environment variables
   VITE_API_URL=your_api_url
   VITE_JWT_SECRET=your_jwt_secret
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### API Endpoints
```javascript
export const API_ENDPOINTS = {
  LOGIN: '/admin/login',
  USERS: '/admin/users',
  LOANS: '/admin/loans',
  DONATIONS: '/admin/donations',
  // ... other endpoints
}
```

### Authentication
- JWT-based authentication
- Role-based access control
- Session management
- Secure password handling

## 📊 Data Management

### Export Formats
- PDF Reports
- Excel Sheets
- CSV Data
- JSON API responses

### Data Security
- Encrypted storage
- Secure API calls
- Data backup
- Access logging

## 🎨 UI/UX Features

- Responsive design
- Dark/Light theme
- Interactive charts
- Sortable tables
- Filter systems
- Search functionality
- Batch operations
- Drag-and-drop interfaces

## 🔍 Monitoring & Logging

- User activity logs
- System error logging
- Performance monitoring
- Security audit trails
- API request logging

## 🚀 Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Production Setup**
   ```bash
   # Serve production build
   npm run serve
   ```

3. **Docker Support**
   ```bash
   # Build Docker image
   docker build -t pennyrelief-admin .

   # Run container
   docker run -p 3000:3000 pennyrelief-admin
   ```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run lint
npm run lint
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔒 Security

- HTTPS enforced
- JWT authentication
- Role-based access
- Input sanitization
- XSS protection
- CSRF protection
- Rate limiting

## 👥 Team

- **Lead Developer**: Muhammadrabeet56
- **UI/UX Designer**: [Designer Name]
- **Project Manager**: [Manager Name]

## 📄 License

This project is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this project, via any medium, is strictly prohibited.

## 🆘 Support

For technical support:
- Email: [support-email]
- Issue Tracker: GitHub Issues
- Documentation: [Wiki Link]

## 🔄 Version History

- v1.0.0 - Initial Release
  - Basic admin features
  - User management
  - Loan processing

- v1.1.0 - Feature Update
  - Enhanced analytics
  - Export functionality
  - Performance improvements

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
