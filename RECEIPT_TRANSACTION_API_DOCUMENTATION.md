# Receipt Transaction API Documentation

## Overview
This document provides comprehensive API documentation for the Receipt Transaction Management System, including all endpoints, request/response formats, and usage examples. The system handles receipt management with automatic USD to INR conversion and comprehensive bill adjustment tracking.

**Important Note:** Bill number validation has been disabled. Users can pass any bill number without checking if it exists in sales transactions. The system will store and process receipts based on the provided bill number without additional validation.

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

## 1. Create Receipt Transaction

**Endpoint:** `POST /receipt-transactions`

**Description:** Create a new receipt transaction with automatic USD to INR conversion, UTR number tracking, and bill reference validation.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "receiptDate": "2024-01-15",
  "creditPartyId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "billNumber": "ABC0001",
  "billAmount": 18812.50,
  "receiptAmount": 2500.00,
  "currency": "USD",
  "exchangeRate": 83.25,
  "utrNumber": "UTR123456789012",
  "remarks": "Partial payment received for cotton fabric order",
  "customField1": "Custom Value 1"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `receiptDate` | Date | Yes | Date of receipt |
| `creditPartyId` | ObjectId | Yes | Credit party master ID (dropdown selection) |
| `billNumber` | String | Yes | Bill number from sales transaction |
| `billAmount` | Number | Yes | Total bill amount |
| `receiptAmount` | Number | Yes | Amount received |
| `currency` | String | Yes | Currency of receipt (INR, USD, EUR, GBP) |
| `exchangeRate` | Number | No | Exchange rate for USD to INR conversion |
| `utrNumber` | String | Yes | UTR (Unique Transaction Reference) number |
| `remarks` | String | No | Additional remarks |
| `customField*` | Any | No | Additional custom fields |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Receipt transaction created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
    "receiptNumber": "RCP000001",
    "receiptDate": "2024-01-15T00:00:00.000Z",
    "creditParty": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "partyName": "Global Importers Ltd",
      "country": "United States",
      "port": "New York"
    },
    "billNumber": "ABC0001",
    "billAmount": 18812.50,
    "receiptAmount": 2500.00,
    "inrAmount": 208125.00,
    "currency": "USD",
    "exchangeRate": 83.25,
    "utrNumber": "UTR123456789012",
    "remarks": "Partial payment received for cotton fabric order",
    "salesTransaction": "64f8a1b2c3d4e5f6a7b8c9d8",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d9",
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
  "message": "Receipt date, credit party, bill number, receipt amount, and currency are required"
}
```

**Note:** Bill number validation has been disabled. Users can pass any bill number without checking if it exists in sales transactions.

---

## 2. Get All Receipt Transactions

**Endpoint:** `GET /receipt-transactions`

**Description:** Get all receipt transactions with pagination, filtering, and search capabilities.

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
| `search` | String | No | Search in receipt number, bill number, UTR number, credit party name |
| `creditPartyId` | ObjectId | No | Filter by credit party ID |
| `billNumber` | String | No | Filter by bill number |
| `startDate` | Date | No | Filter by start date |
| `endDate` | Date | No | Filter by end date |
| `currency` | String | No | Filter by currency |
| `isActive` | Boolean | No | Filter by active status |

**Example Request:**
```
GET /receipt-transactions?page=1&limit=5&search=ABC&currency=USD&startDate=2024-01-01&endDate=2024-01-31
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
      "receiptNumber": "RCP000001",
      "receiptDate": "2024-01-15T00:00:00.000Z",
      "creditParty": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "partyName": "Global Importers Ltd",
        "country": "United States",
        "port": "New York"
      },
      "billNumber": "ABC0001",
      "billAmount": 18812.50,
      "receiptAmount": 2500.00,
      "inrAmount": 208125.00,
      "currency": "USD",
      "utrNumber": "UTR123456789012",
      "salesTransaction": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
        "transactionNumber": "ABC0001",
        "company": {
          "companyName": "ABC Corporation Ltd",
          "firmId": "FIRM001"
        },
        "debitParty": {
          "partyName": "XYZ Trading Co"
        },
        "totalAmount": 18812.50
      },
      "isActive": true,
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d9",
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

## 3. Get Receipt Transaction by ID

**Endpoint:** `GET /receipt-transactions/:id`

**Description:** Get a specific receipt transaction by its ID with full details.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Receipt transaction ID (MongoDB ObjectId)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
    "receiptNumber": "RCP000001",
    "receiptDate": "2024-01-15T00:00:00.000Z",
    "creditParty": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "partyName": "Global Importers Ltd",
      "country": "United States",
      "port": "New York"
    },
    "billNumber": "ABC0001",
    "billAmount": 18812.50,
    "receiptAmount": 2500.00,
    "inrAmount": 208125.00,
    "currency": "USD",
    "exchangeRate": 83.25,
    "utrNumber": "UTR123456789012",
    "remarks": "Partial payment received for cotton fabric order",
    "salesTransaction": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
      "transactionNumber": "ABC0001",
      "company": {
        "companyName": "ABC Corporation Ltd",
        "firmId": "FIRM001"
      },
      "debitParty": {
        "partyName": "XYZ Trading Co"
      },
      "totalAmount": 18812.50,
      "items": [
        {
          "item": {
            "itemName": "Cotton Fabric",
            "itemHsn": "5208",
            "itemUnits": "sqm"
          },
          "quantity": 100,
          "rate": 150.50,
          "amount": 15050
        }
      ]
    },
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d9",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d9",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## 4. Update Receipt Transaction

**Endpoint:** `PUT /receipt-transactions/:id`

**Description:** Update an existing receipt transaction. Only provided fields will be updated.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Receipt transaction ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "receiptAmount": 3000.00,
  "exchangeRate": 83.50,
  "utrNumber": "UTR123456789013",
  "remarks": "Updated payment amount and UTR number"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Receipt transaction updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
    "receiptNumber": "RCP000001",
    "receiptAmount": 3000.00,
    "inrAmount": 250500.00,
    "exchangeRate": 83.50,
    "utrNumber": "UTR123456789013",
    "remarks": "Updated payment amount and UTR number",
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d9",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

## 5. Delete Receipt Transaction

**Endpoint:** `DELETE /receipt-transactions/:id`

**Description:** Delete a receipt transaction permanently.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Receipt transaction ID (MongoDB ObjectId)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Receipt transaction deleted successfully"
}
```

---

## 6. Search Receipt Transactions by Bill Number

**Endpoint:** `GET /receipt-transactions/search/bill-number/:billNumber`

**Description:** Search for receipt transactions using a specific bill number.

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
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
      "receiptNumber": "RCP000001",
      "receiptDate": "2024-01-15T00:00:00.000Z",
      "creditParty": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "partyName": "Global Importers Ltd",
        "country": "United States",
        "port": "New York"
      },
      "billNumber": "ABC0001",
      "receiptAmount": 2500.00,
      "currency": "USD",
      "inrAmount": 208125.00,
      "utrNumber": "UTR123456789012"
    }
  ]
}
```

---

## 7. Get Receipt Transactions by Credit Party

**Endpoint:** `GET /receipt-transactions/credit-party/:creditPartyId`

**Description:** Get all receipt transactions for a specific credit party with pagination.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `creditPartyId`: Credit party ID (MongoDB ObjectId)

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
      "receiptNumber": "RCP000001",
      "receiptDate": "2024-01-15T00:00:00.000Z",
      "billNumber": "ABC0001",
      "receiptAmount": 2500.00,
      "currency": "USD",
      "inrAmount": 208125.00,
      "utrNumber": "UTR123456789012"
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

## 8. Bill Adjustment Summary

**Endpoint:** `GET /receipt-transactions/bill-adjustment/:billNumber`

**Description:** Get comprehensive bill adjustment summary showing pending and received payments for a specific bill.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `billNumber`: Bill number to get adjustment summary for (e.g., ABC0001)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "billNumber": "ABC0001",
    "billDetails": {
      "company": "ABC Corporation Ltd",
      "debitParty": "XYZ Trading Co",
      "creditParty": "Global Importers Ltd",
      "billDate": "2024-01-15T00:00:00.000Z",
      "totalAmount": 18812.50,
      "currency": "INR"
    },
    "paymentSummary": {
      "totalBillAmount": 18812.50,
      "totalReceivedAmount": 2500.00,
      "pendingAmount": 16312.50,
      "isFullyPaid": false,
      "paymentStatus": "Partially Paid"
    },
    "currencyBreakdown": {
      "USD": 2500.00,
      "INR": 5000.00
    },
    "receiptTransactions": [
      {
        "receiptNumber": "RCP000001",
        "receiptDate": "2024-01-15T00:00:00.000Z",
        "amount": 2500.00,
        "currency": "USD",
        "inrAmount": 208125.00,
        "utrNumber": "UTR123456789012",
        "remarks": "Partial payment received"
      },
      {
        "receiptNumber": "RCP000002",
        "receiptDate": "2024-01-16T00:00:00.000Z",
        "amount": 5000.00,
        "currency": "INR",
        "inrAmount": 5000.00,
        "utrNumber": "UTR123456789013",
        "remarks": "Second partial payment"
      }
    ]
  }
}
```

---

## 9. Get Pending Bills

**Endpoint:** `GET /receipt-transactions/pending-bills`

**Description:** Get all pending bills with payment status, showing which bills are partially paid or unpaid.

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `creditPartyId`: Filter by specific credit party ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "billNumber": "ABC0001",
      "billDate": "2024-01-15T00:00:00.000Z",
      "company": "ABC Corporation Ltd",
      "debitParty": "XYZ Trading Co",
      "creditParty": "Global Importers Ltd",
      "totalAmount": 18812.50,
      "currency": "INR",
      "totalReceived": 2500.00,
      "pendingAmount": 16312.50,
      "paymentStatus": "Partially Paid",
      "lastReceiptDate": "2024-01-16T00:00:00.000Z"
    },
    {
      "billNumber": "ABC0002",
      "billDate": "2024-01-20T00:00:00.000Z",
      "company": "ABC Corporation Ltd",
      "debitParty": "XYZ Trading Co",
      "creditParty": "Global Importers Ltd",
      "totalAmount": 25000.00,
      "currency": "INR",
      "totalReceived": 0,
      "pendingAmount": 25000.00,
      "paymentStatus": "Partially Paid",
      "lastReceiptDate": null
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 2,
    "itemsPerPage": 10
  }
}
```

---

## Key Features

### 1. Automatic USD to INR Conversion
- **Real-time Conversion:** Automatically converts USD amounts to INR using provided exchange rate
- **Dual Storage:** Stores both original currency amount and converted INR amount
- **Exchange Rate Tracking:** Maintains exchange rate used for each conversion

### 2. UTR Number Management
- **Unique Tracking:** Each receipt has a unique UTR number for bank transaction tracking
- **Search Capability:** Can search receipts by UTR number
- **Validation:** Ensures UTR number is provided for each receipt

### 3. Bill Adjustment Tracking
- **Payment Status:** Shows fully paid, partially paid, or overpaid status
- **Pending Amount Calculation:** Automatically calculates remaining amount to be paid
- **Currency Breakdown:** Shows receipts grouped by currency with totals

### 4. Comprehensive Receipt Management
- **Credit Party Integration:** Links receipts to credit party master data
- **Bill Reference:** Each receipt is linked to a specific sales transaction bill
- **Amount Validation:** Ensures receipt amounts are valid and tracked

---

## Data Models

### Receipt Transaction Schema
```javascript
{
  receiptNumber: String (auto-generated),
  receiptDate: Date (required),
  creditParty: {
    _id: ObjectId (CreditParty reference),
    partyName: String,
    country: String,
    port: String
  },
  billNumber: String (required, no validation),
  billAmount: Number (required),
  receiptAmount: Number (required),
  inrAmount: Number (required, auto-calculated),
  currency: String (enum: INR, USD, EUR, GBP),
  exchangeRate: Number (default: 1),
  utrNumber: String (required),
  remarks: String,
  isActive: Boolean,
  createdBy: ObjectId (User reference),
  updatedBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Business Logic

### USD to INR Conversion
```javascript
// Automatic conversion when currency is USD
if (currency === 'USD' && exchangeRate) {
  inrAmount = receiptAmount * exchangeRate;
} else {
  inrAmount = receiptAmount; // For INR receipts
}
```

### Bill Adjustment Calculation
```javascript
// Calculate pending amount
const totalReceivedAmount = receipts.reduce((sum, receipt) => {
  return sum + (receipt.currency === 'USD' ? receipt.inrAmount : receipt.receiptAmount);
}, 0);

const pendingAmount = totalBillAmount - totalReceivedAmount;
const isFullyPaid = pendingAmount <= 0;
```

### Payment Status Determination
```javascript
const paymentStatus = isFullyPaid ? 'Fully Paid' : 
                     pendingAmount > 0 ? 'Partially Paid' : 'Overpaid';
```

---

## Error Handling

### Validation Errors (400)
- Missing required fields
- Invalid data types
- Business rule violations
- Bill number not found

### Not Found Errors (404)
- Invalid receipt transaction ID
- Receipt transaction doesn't exist
- Sales transaction not found

### Authentication Errors (401)
- Missing or invalid JWT token
- Token expired

### Server Errors (500)
- Database connection issues
- Internal processing errors

---

## Usage Examples

### Complete Receipt Flow

1. **Create Receipt:**
```bash
curl -X POST http://localhost:3000/receipt-transactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "receiptDate": "2024-01-15",
    "creditPartyId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "billNumber": "ABC0001",
    "billAmount": 18812.50,
    "receiptAmount": 2500.00,
    "currency": "USD",
    "exchangeRate": 83.25,
    "utrNumber": "UTR123456789012",
    "remarks": "Partial payment received"
  }'
```

2. **Get Receipt:**
```bash
curl -X GET http://localhost:3000/receipt-transactions/64f8a1b2c3d4e5f6a7b8c9d7 \
  -H "Authorization: Bearer <token>"
```

3. **Update Receipt:**
```bash
curl -X PUT http://localhost:3000/receipt-transactions/64f8a1b2c3d4e5f6a7b8c9d7 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "receiptAmount": 3000.00,
    "exchangeRate": 83.50,
    "utrNumber": "UTR123456789013"
  }'
```

4. **Search by Bill Number:**
```bash
curl -X GET http://localhost:3000/receipt-transactions/search/bill-number/ABC0001 \
  -H "Authorization: Bearer <token>"
```

5. **Get Bill Adjustment:**
```bash
curl -X GET http://localhost:3000/receipt-transactions/bill-adjustment/ABC0001 \
  -H "Authorization: Bearer <token>"
```

6. **Get Pending Bills:**
```bash
curl -X GET "http://localhost:3000/receipt-transactions/pending-bills?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

7. **Get Credit Party Receipts:**
```bash
curl -X GET "http://localhost:3000/receipt-transactions/credit-party/64f8a1b2c3d4e5f6a7b8c9d0?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

## Integration Points

### Required Master Data
- **Credit Party Master:** For buyer details and receipt tracking
- **Sales Transaction:** For bill reference and validation
- **User Master:** For audit trail and user management

### Dependencies
- **Authentication Middleware:** JWT token validation
- **Database Models:** All master data models must exist
- **Validation:** Comprehensive input validation and business rule checking

---

## Currency Conversion Examples

### USD to INR Conversion
```json
{
  "receiptAmount": 1000.00,
  "currency": "USD",
  "exchangeRate": 83.25,
  "inrAmount": 83250.00
}
```

### INR Receipt (No Conversion)
```json
{
  "receiptAmount": 50000.00,
  "currency": "INR",
  "exchangeRate": 1,
  "inrAmount": 50000.00
}
```

### EUR to INR Conversion
```json
{
  "receiptAmount": 500.00,
  "currency": "EUR",
  "exchangeRate": 90.50,
  "inrAmount": 45250.00
}
```

---

This comprehensive API documentation provides all the information needed to integrate with the Receipt Transaction Management System, including the specific features requested: receipt creation with credit party selection, bill number reference, USD to INR conversion, UTR number tracking, and comprehensive bill adjustment capabilities for pending and received payments.
