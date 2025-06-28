# Dynamic Contract Management Platform

A comprehensive contract management platform built with Svelte and Node.js, featuring real-time cost calculation, JSON-driven templates, and Docker containerization.

## 🏗️ Architecture Overview

This platform implements a hybrid monolith-microservice architecture as specified in the technical blueprint:

- **Frontend**: Svelte with Vite build tool
- **Backend**: Node.js with Express framework
- **Data**: JSON Schema-driven contract structure
- **Deployment**: Docker containerization for cross-platform compatibility

## ✨ Key Features

### MVP Features (Current Implementation)
- ✅ **Dynamic Contract Creation**: Interactive form with real-time validation
- ✅ **Live Cost Calculator**: Instant total updates as users modify costs
- ✅ **JSON Schema Validation**: Comprehensive data validation on client and server
- ✅ **Import/Export**: JSON file import/export functionality
- ✅ **Template System**: Pre-built contract templates
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Cross-platform Development**: Windows to Linux deployment workflow

### Future Enhancements
- 🔄 **Template Creation Wizard**: Visual drag-and-drop template builder
- 🔄 **Contract Comparison**: Side-by-side contract analysis
- 🔄 **PDF Generation**: Export contracts as PDF documents
- 🔄 **User Authentication**: Multi-user support with role-based access
- 🔄 **Database Integration**: PostgreSQL for persistent data storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- Docker and Docker Compose (optional but recommended)

### Local Development Setup

1. **Clone and Navigate**
   ```bash
   cd FLOTTE
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend
   cd server
   npm run dev

   # Terminal 2: Start frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Docker Development Setup

1. **Start with Docker Compose**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏢 Project Structure

```
FLOTTE/
├── src/                          # Frontend Svelte application
│   ├── components/               # Reusable Svelte components
│   │   ├── Dashboard.svelte      # Main dashboard view
│   │   ├── ContractEditor.svelte # Contract creation interface
│   │   ├── LiveCalculator.svelte # Real-time cost calculator
│   │   └── ...
│   ├── stores/                   # Svelte stores for state management
│   │   └── index.js              # Central data store with reactive calculations
│   ├── schemas/                  # JSON schemas for validation
│   │   └── contract-schema.json  # Master contract schema
│   └── main.js                   # Application entry point
├── server/                       # Backend Node.js application
│   ├── routes/                   # API route handlers
│   │   ├── contracts.js          # Contract CRUD operations
│   │   ├── templates.js          # Template management
│   │   └── validation.js         # Schema validation endpoints
│   ├── middleware/               # Express middleware
│   │   ├── errorHandler.js       # Global error handling
│   │   └── validation.js         # Request validation
│   ├── schemas/                  # Backend schema definitions
│   └── server.js                 # Express server configuration
├── docker-compose.yml            # Production Docker configuration
├── docker-compose.dev.yml        # Development Docker configuration
└── README.md                     # This file
```

## 🎯 Core Features Explained

### Live Cost Calculator
The heart of the application is the real-time cost calculator that updates instantly as users modify:
- Line item quantities and prices
- Discount percentages or fixed amounts
- Cost types (one-time, monthly, yearly)

**Technical Implementation:**
- Uses Svelte's reactive stores for state management
- Derived store automatically recalculates totals when dependencies change
- No manual DOM manipulation required - framework handles updates efficiently

### JSON Schema Validation
All contract data is validated against a comprehensive JSON Schema that ensures:
- Required fields are present
- Data types are correct
- Business rules are enforced (e.g., positive costs, valid date formats)
- Consistent structure across the platform

### Template System
Pre-built templates accelerate contract creation:
- **Standard Service Contract**: General services template
- **Consulting Agreement**: Specialized for consulting work
- **Custom Templates**: Users can create and save their own templates (future feature)

## 🛠️ API Endpoints

### Contracts
- `GET /api/contracts` - List all contracts
- `POST /api/contracts` - Create new contract
- `GET /api/contracts/:id` - Get specific contract
- `PUT /api/contracts/:id` - Update contract
- `DELETE /api/contracts/:id` - Delete contract
- `POST /api/contracts/validate` - Validate contract data

### Templates
- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get specific template
- `POST /api/templates/:id/use` - Create contract from template

### Validation
- `POST /api/validation/contract` - Validate contract against schema
- `GET /api/validation/schema` - Get current JSON schema
- `GET /api/validation/rules` - Get validation rules

## 🐋 Docker Deployment

### Development Environment
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production Environment
```bash
docker-compose up --build
```

### Production Deployment on Ubuntu Server
1. **Install Docker and Docker Compose**
2. **Clone the repository**
3. **Create production environment file**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```
4. **Deploy**
   ```bash
   docker-compose up -d
   ```

## 🔒 Security Features

- **Input Validation**: Comprehensive validation on both client and server
- **Rate Limiting**: Prevents API abuse
- **Security Headers**: Helmet.js for security headers
- **CORS Configuration**: Controlled cross-origin requests
- **Error Handling**: Secure error responses that don't leak internal information

## 🧪 Data Model

### Contract Structure
```json
{
  "schemaVersion": "1.0.0",
  "contractMetadata": {
    "contractName": "Web Development Contract",
    "clientName": "Acme Corp",
    "effectiveDate": "2025-07-01",
    "projectDescription": "Complete website redesign"
  },
  "lineItems": [
    {
      "id": "uuid",
      "description": "Website Development",
      "costType": "one-off",
      "unitCost": 5000,
      "quantity": 1
    }
  ],
  "discounts": [
    {
      "description": "Early Payment Discount",
      "type": "percentage",
      "value": 10
    }
  ]
}
```

## 🛣️ Development Roadmap

### Phase 1: MVP (Current) ✅
- Core contract creation and editing
- Real-time cost calculation
- Basic template system
- JSON import/export
- Docker containerization

### Phase 2: Enhanced Features
- Visual template creation wizard using SurveyJS
- User authentication and authorization
- Contract comparison application (microservice)
- Database persistence (PostgreSQL)

### Phase 3: Advanced Features
- PDF generation
- Email notifications
- Third-party integrations (QuickBooks, Jira)
- Advanced analytics dashboard

### Phase 4: Enterprise Features
- Multi-tenant architecture
- API rate limiting and quotas
- Advanced reporting
- Workflow automation

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests** (when available)
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Additional Resources

- [Svelte Documentation](https://svelte.dev/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JSON Schema Specification](https://json-schema.org/)
- [Docker Documentation](https://docs.docker.com/)
- [Technical Architecture Blueprint](docs/architecture.md) (detailed technical specifications)

---

**Built with ❤️ using modern web technologies for maximum performance and developer experience.**
