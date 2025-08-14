# Sales Transaction API Documentation

## Overview
This document provides comprehensive API documentation for the Sales Transaction Management System, including all endpoints, request/response formats, and usage examples.

## Base URL
```
http://localhost:3000
```

## Authentication
All API endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Create Sales Transaction

**Endpoint:** `POST /sales-transactions`

**Description:** Create a new sales transaction with automatic bill number generation, AI-generated covering notes, and comprehensive validation.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "companyId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "debitPartyId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "creditPartyId": "64f8a1b2c3d4e5f6a7b8c9d2",
  "transactionDate": "2024-01-15",
  "items": [
    {
      "itemId": "64f8a1b2c3d4e5f6a7b8c9d3",
      "quantity": 100,
      "rate": 150.50,
      "description": "Premium quality cotton fabric with special finish"
    },
    {
      "itemId": "64f8a1b2c3d4e5f6a7b8c9d4",
      "quantity": 50,
      "rate": 75.25,
      "description": "Standard cotton fabric"
    }
  ],
  "currency": "INR",
  "brokerId": "64f8a1b2c3d4e5f6a7b8c9d5",
  "chaId": "64f8a1b2c3d4e5f6a7b8c9d6",
  "remarks": "Urgent delivery required",
  "customField1": "Custom Value 1"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `companyId` | ObjectId | Yes | Company master ID (dropdown selection) |
| `debitPartyId` | ObjectId | Yes | Debit party ID with license number details |
| `creditPartyId` | ObjectId | Yes | Credit party ID (dropdown selection) |
| `transactionDate` | Date | Yes | Transaction date |
| `items` | Array | Yes | Array of items with quantity, rate, and description |
| `items[].itemId` | ObjectId | Yes | Item master ID |
| `items[].quantity` | Number | Yes | Item quantity |
| `items[].rate` | Number | Yes | Item rate per unit |
| `items[].description` | String | No | Custom description for each item |
| `currency` | String | No | Currency (default: INR) |
| `brokerId` | ObjectId | No | Broker ID |
| `chaId` | ObjectId | No | CHA (Customs House Agent) ID |
| `remarks` | String | No | General remarks |
| `customField*` | Any | No | Additional custom fields |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Sales transaction created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
    "transactionNumber": "ABC0001",
    "transactionDate": "2024-01-15T00:00:00.000Z",
    "company": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "companyName": "ABC Corporation Ltd",
      "firmId": "FIRM001",
      "gstNo": "27ABCDE1234F1Z5"
    },
    "debitParty": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "partyName": "XYZ Trading Co",
      "gstNo": "27XYZ1234567890Z",
      "panNo": "XYZAB1234C",
      "iecNo": "IEC123456",
      "epcgLicNo": {
        "lic1": "LIC001",
        "lic2": "LIC002",
        "lic3": "LIC003"
      }
    },
    "creditParty": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "partyName": "Global Importers Ltd",
      "country": "United States",
      "port": "New York"
    },
    "items": [
      {
        "item": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
          "itemName": "Cotton Fabric",
          "itemHsn": "5208",
          "itemUnits": "sqm"
        },
        "quantity": 100,
        "rate": 150.50,
        "amount": 15050,
        "description": "Premium quality cotton fabric with special finish"
      },
      {
        "item": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
          "itemName": "Standard Cotton",
          "itemHsn": "5209",
          "itemUnits": "sqm"
        },
        "quantity": 50,
        "rate": 75.25,
        "amount": 3762.5,
        "description": "Standard cotton fabric"
      }
    ],
    "totalAmount": 18812.5,
    "currency": "INR",
    "broker": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
      "brokerName": "Global Brokers Ltd"
    },
    "cha": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
      "chaName": "Customs House Agent Ltd"
    },
    "remarks": "Urgent delivery required",
    "coveringNotes": "Subject: Sales Transaction - ABC Corporation Ltd to Global Importers Ltd\n\nDear Global Importers Ltd,\n\nWe are pleased to confirm the sales transaction details as follows:\n\n**Transaction Summary:**\n• Company: ABC Corporation Ltd\n• Debit Party: XYZ Trading Co\n• Credit Party: Global Importers Ltd\n• Total Amount: INR 18,812.50\n\n**Items Included:**\n1. Cotton Fabric - Qty: 100 sqm @ INR 150.50 = INR 15,050.00\n   Description: Premium quality cotton fabric with special finish\n2. Standard Cotton - Qty: 50 sqm @ INR 75.25 = INR 3,762.50\n   Description: Standard cotton fabric\n\n**Terms & Conditions:**\n• Payment terms: As per agreed terms\n• Delivery: As per agreed schedule\n• Quality: As per specifications\n\nPlease confirm receipt of this transaction and contact us for any queries.\n\nBest regards,\nABC Corporation Ltd",
    "status": "draft",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "customField1": "Custom Value 1"
  }
}
```

**Error Response (400) - Validation Error:**
```json
{
  "success": false,
  "message": "Company, debit party, credit party, transaction date, and items are required"
}
```

**Error Response (400) - Item Validation Error:**
```json
{
  "success": false,
  "message": "Item ID, quantity, and rate are required for all items"
}
```

---

## 2. Get All Sales Transactions

**Endpoint:** `GET /sales-transactions`

**Description:** Get all sales transactions with pagination, filtering, and search capabilities.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | Number | No | Page number (default: 1) |
| `limit` | Number | No | Items per page (default: 10) |
| `search` | String | No | Search in transaction number, company name, party names |
| `companyId` | ObjectId | No | Filter by company ID |
| `debitPartyId` | ObjectId | No | Filter by debit party ID |
| `creditPartyId` | ObjectId | No | Filter by credit party ID |
| `status` | String | No | Filter by status (draft, pending, approved, completed, cancelled) |
| `startDate` | Date | No | Filter by start date |
| `endDate` | Date | No | Filter by end date |
| `isActive` | Boolean | No | Filter by active status |

**Example Request:**
```
GET /sales-transactions?page=1&limit=5&search=ABC&companyId=64f8a1b2c3d4e5f6a7b8c9d0&status=draft&startDate=2024-01-01&endDate=2024-01-31
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
      "transactionNumber": "ABC0001",
      "transactionDate": "2024-01-15T00:00:00.000Z",
      "company": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "companyName": "ABC Corporation Ltd",
        "firmId": "FIRM001",
        "gstNo": "27ABCDE1234F1Z5"
      },
      "debitParty": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "partyName": "XYZ Trading Co",
        "gstNo": "27XYZ1234567890Z",
        "panNo": "XYZAB1234C",
        "iecNo": "IEC123456",
        "epcgLicNo": {
          "lic1": "LIC001",
          "lic2": "LIC002",
          "lic3": "LIC003"
        }
      },
      "creditParty": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "partyName": "Global Importers Ltd",
        "country": "United States",
        "port": "New York"
      },
      "totalAmount": 18812.5,
      "currency": "INR",
      "status": "draft",
      "isActive": true,
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 5
  }
}
```

---

## 3. Get Sales Transaction by ID

**Endpoint:** `GET /sales-transactions/:id`

**Description:** Get a specific sales transaction by its ID with full details.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Sales transaction ID (MongoDB ObjectId)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
    "transactionNumber": "ABC0001",
    "transactionDate": "2024-01-15T00:00:00.000Z",
    "company": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "companyName": "ABC Corporation Ltd",
      "firmId": "FIRM001",
      "gstNo": "27ABCDE1234F1Z5"
    },
    "debitParty": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "partyName": "XYZ Trading Co",
      "gstNo": "27XYZ1234567890Z",
      "panNo": "XYZAB1234C",
      "iecNo": "IEC123456",
      "epcgLicNo": {
        "lic1": "LIC001",
        "lic2": "LIC002",
        "lic3": "LIC003"
      }
    },
    "creditParty": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "partyName": "Global Importers Ltd",
      "country": "United States",
      "port": "New York"
    },
    "items": [
      {
        "item": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
          "itemName": "Cotton Fabric",
          "itemHsn": "5208",
          "itemUnits": "sqm"
        },
        "quantity": 100,
        "rate": 150.50,
        "amount": 15050,
        "description": "Premium quality cotton fabric with special finish"
      }
    ],
    "totalAmount": 18812.5,
    "currency": "INR",
    "broker": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
      "brokerName": "Global Brokers Ltd"
    },
    "cha": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
      "chaName": "Customs House Agent Ltd"
    },
    "remarks": "Urgent delivery required",
    "coveringNotes": "Subject: Sales Transaction - ABC Corporation Ltd to Global Importers Ltd...",
    "status": "draft",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Response (404) - Not Found:**
```json
{
  "success": false,
  "message": "Sales transaction not found"
}
```

---

## 4. Update Sales Transaction

**Endpoint:** `PUT /sales-transactions/:id`

**Description:** Update an existing sales transaction. Only provided fields will be updated.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Sales transaction ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "transactionDate": "2024-01-16",
  "items": [
    {
      "itemId": "64f8a1b2c3d4e5f6a7b8c9d3",
      "quantity": 120,
      "rate": 160.00,
      "description": "Updated description for premium cotton fabric"
    }
  ],
  "status": "pending",
  "remarks": "Updated remarks for the transaction"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Sales transaction updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
    "transactionNumber": "ABC0001",
    "transactionDate": "2024-01-16T00:00:00.000Z",
    "items": [
      {
        "item": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
          "itemName": "Cotton Fabric",
          "itemHsn": "5208",
          "itemUnits": "sqm"
        },
        "quantity": 120,
        "rate": 160.00,
        "amount": 19200,
        "description": "Updated description for premium cotton fabric"
      }
    ],
    "totalAmount": 19200,
    "status": "pending",
    "remarks": "Updated remarks for the transaction",
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

## 5. Delete Sales Transaction

**Endpoint:** `DELETE /sales-transactions/:id`

**Description:** Delete a sales transaction permanently.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Sales transaction ID (MongoDB ObjectId)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Sales transaction deleted successfully"
}
```

---

## 6. Search Sales Transaction by Bill Number

**Endpoint:** `GET /sales-transactions/search/bill-number/:billNumber`

**Description:** Search for a sales transaction using its bill number.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `billNumber`: Bill number to search for (e.g., ABC0001)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
    "transactionNumber": "ABC0001",
    "transactionDate": "2024-01-15T00:00:00.000Z",
    "company": {
      "companyName": "ABC Corporation Ltd",
      "firmId": "FIRM001"
    },
    "debitParty": {
      "partyName": "XYZ Trading Co",
      "gstNo": "27XYZ1234567890Z"
    },
    "creditParty": {
      "partyName": "Global Importers Ltd",
      "country": "United States"
    },
    "totalAmount": 18812.5,
    "currency": "INR"
  }
}
```

---

## 7. Get Sales Transactions by Company

**Endpoint:** `GET /sales-transactions/company/:companyId`

**Description:** Get all sales transactions for a specific company with pagination.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `companyId`: Company ID (MongoDB ObjectId)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
      "transactionNumber": "ABC0001",
      "transactionDate": "2024-01-15T00:00:00.000Z",
      "totalAmount": 18812.5,
      "currency": "INR",
      "status": "draft"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}
```

---

## Key Features

### 1. Automatic Bill Number Generation
- **Format:** Company initials + sequential number (e.g., ABC0001, ABC0002)
- **Logic:** Extracts first letter of each word in company name
- **Sequencing:** Automatically increments based on existing transactions

### 2. AI-Generated Covering Notes
- **Content:** Professional business letter format
- **Details:** Transaction summary, item breakdown, terms & conditions
- **Dynamic:** Automatically updates when transaction details change

### 3. Comprehensive Item Management
- **Quantity & Rate:** Automatic calculation of line item amounts
- **Custom Descriptions:** Individual description field for each item
- **Total Calculation:** Automatic sum of all line items

### 4. License Number Integration
- **Debit Party:** Includes GST, PAN, IEC, and EPCG license details
- **Validation:** Ensures all required license information is captured

### 5. Flexible Schema
- **Custom Fields:** Support for additional business-specific fields
- **Extensible:** Easy to add new fields without code changes

---

## Data Models

### Sales Transaction Schema
```javascript
{
  transactionNumber: String (auto-generated bill number),
  transactionDate: Date (required),
  company: {
    _id: ObjectId (Company reference),
    companyName: String,
    firmId: String,
    gstNo: String
  },
  debitParty: {
    _id: ObjectId (DebitParty reference),
    partyName: String,
    gstNo: String,
    panNo: String,
    iecNo: String,
    epcgLicNo: {
      lic1: String,
      lic2: String,
      lic3: String
    }
  },
  creditParty: {
    _id: ObjectId (CreditParty reference),
    partyName: String,
    country: String,
    port: String
  },
  items: [{
    item: ObjectId (Item reference),
    quantity: Number,
    rate: Number,
    amount: Number (auto-calculated),
    description: String (custom field)
  }],
  totalAmount: Number (auto-calculated),
  currency: String (default: INR),
  broker: ObjectId (Broker reference),
  cha: ObjectId (CHA reference),
  remarks: String,
  coveringNotes: String (AI-generated),
  status: String (enum: draft, pending, approved, completed, cancelled),
  isActive: Boolean,
  createdBy: ObjectId (User reference),
  updatedBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Business Logic

### Bill Number Generation
```javascript
// Example: "ABC Corporation Ltd" -> "ABC0001"
const initials = companyName
  .split(' ')
  .map(word => word.charAt(0).toUpperCase())
  .join('');

const sequenceNumber = latestTransaction ? 
  parseInt(latestTransaction.transactionNumber.match(/\d+$/)[0]) + 1 : 1;

return `${initials}${sequenceNumber.toString().padStart(4, '0')}`;
```

### Amount Calculation
```javascript
// For each item
const amount = quantity * rate;
totalAmount += amount;

// Total is automatically calculated and stored
```

### Covering Notes Generation
- **Template-based:** Uses predefined business letter template
- **Dynamic content:** Populates with actual transaction data
- **Professional format:** Includes all relevant business information

---

## Error Handling

### Validation Errors (400)
- Missing required fields
- Invalid data types
- Business rule violations

### Not Found Errors (404)
- Invalid transaction ID
- Transaction doesn't exist

### Authentication Errors (401)
- Missing or invalid JWT token
- Token expired

### Server Errors (500)
- Database connection issues
- Internal processing errors

---

## Usage Examples

### Complete Transaction Flow

1. **Create Transaction:**
```bash
curl -X POST http://localhost:3000/sales-transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "debitPartyId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "creditPartyId": "64f8a1b2c3d4e5f6a7b8c9d2",
    "transactionDate": "2024-01-15",
    "items": [
      {
        "itemId": "64f8a1b2c3d4e5f6a7b8c9d3",
        "quantity": 100,
        "rate": 150.50,
        "description": "Premium cotton fabric"
      }
    ]
  }'
```

2. **Get Transaction:**
```bash
curl -X GET http://localhost:3000/sales-transactions/64f8a1b2c3d4e5f6a7b8c9d7 \
  -H "Authorization: Bearer <token>"
```

3. **Update Transaction:**
```bash
curl -X PUT http://localhost:3000/sales-transactions/64f8a1b2c3d4e5f6a7b8c9d7 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "pending",
    "remarks": "Updated remarks"
  }'
```

4. **Search by Bill Number:**
```bash
curl -X GET http://localhost:3000/sales-transactions/search/bill-number/ABC0001 \
  -H "Authorization: Bearer <token>"
```

5. **Get Company Transactions:**
```bash
curl -X GET "http://localhost:3000/sales-transactions/company/64f8a1b2c3d4e5f6a7b8c9d0?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

## Integration Points

### Required Master Data
- **Company Master:** For company selection and bill number generation
- **Debit Party Master:** For supplier details and license information
- **Credit Party Master:** For buyer details
- **Item Master:** For product selection and pricing
- **Broker Master:** For trading intermediary details
- **CHA Master:** For customs agent details

### Dependencies
- **Authentication Middleware:** JWT token validation
- **Database Models:** All master data models must exist
- **Validation:** Comprehensive input validation and business rule checking

---

This comprehensive API documentation provides all the information needed to integrate with the Sales Transaction Management System, including the specific features requested: company selection, debit party with license details, credit party selection, automatic bill number generation, item management with custom descriptions, automatic calculations, and AI-generated covering notes.
