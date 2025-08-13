# Master Data API Documentation

## Overview
This document provides comprehensive API documentation for the Master Data Management System, including all endpoints, request/response formats, and usage examples.

## Base URL
```
http://localhost:3000
```

## Authentication
All API endpoints (except authentication) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication APIs

### 1.1 User Registration
**POST** `/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. Debit Party Master APIs

### 2.1 Create Debit Party
**POST** `/debit-parties`

**Request Body:**
```json
{
  "partyName": "ABC Trading Co",
  "partyAddress1": "123 Main Street",
  "partyAddress2": "Suite 100",
  "partyAddress3": "Business District",
  "pinCode": "400001",
  "gstNo": "27ABCDE1234F1Z5",
  "panNo": "ABCDE1234F",
  "iecNo": "IEC123456",
  "epcgLicNo": {
    "lic1": "LIC001",
    "lic2": "LIC002",
    "lic3": "LIC003"
  },
  "epcgLicDate": "2024-01-01",
  "epcgLicExpiryReminder": "2025-01-01",
  "customField1": "Custom Value 1"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Debit party created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "partyName": "ABC Trading Co",
    "partyAddress1": "123 Main Street",
    "partyAddress2": "Suite 100",
    "partyAddress3": "Business District",
    "pinCode": "400001",
    "gstNo": "27ABCDE1234F1Z5",
    "panNo": "ABCDE1234F",
    "iecNo": "IEC123456",
    "epcgLicNo": {
      "lic1": "LIC001",
      "lic2": "LIC002",
      "lic3": "LIC003"
    },
    "epcgLicDate": "2024-01-01T00:00:00.000Z",
    "epcgLicExpiryReminder": "2025-01-01T00:00:00.000Z",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "customField1": "Custom Value 1"
  }
}
```

### 2.2 Get All Debit Parties
**GET** `/debit-parties?page=1&limit=10&search=ABC&isActive=true`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in partyName, gstNo, panNo, iecNo
- `isActive` (optional): Filter by active status (true/false)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "partyName": "ABC Trading Co",
      "partyAddress1": "123 Main Street",
      "pinCode": "400001",
      "gstNo": "27ABCDE1234F1Z5",
      "isActive": true,
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
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
    "itemsPerPage": 10
  }
}
```

### 2.3 Get Debit Party by ID
**GET** `/debit-parties/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "partyName": "ABC Trading Co",
    "partyAddress1": "123 Main Street",
    "partyAddress2": "Suite 100",
    "partyAddress3": "Business District",
    "pinCode": "400001",
    "gstNo": "27ABCDE1234F1Z5",
    "panNo": "ABCDE1234F",
    "iecNo": "IEC123456",
    "epcgLicNo": {
      "lic1": "LIC001",
      "lic2": "LIC002",
      "lic3": "LIC003"
    },
    "epcgLicDate": "2024-01-01T00:00:00.000Z",
    "epcgLicExpiryReminder": "2025-01-01T00:00:00.000Z",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2.4 Update Debit Party
**PUT** `/debit-parties/:id`

**Request Body:**
```json
{
  "partyName": "ABC Trading Co Updated",
  "partyAddress1": "456 New Street",
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Debit party updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "partyName": "ABC Trading Co Updated",
    "partyAddress1": "456 New Street",
    "partyAddress2": "Suite 100",
    "partyAddress3": "Business District",
    "pinCode": "400001",
    "gstNo": "27ABCDE1234F1Z5",
    "panNo": "ABCDE1234F",
    "iecNo": "IEC123456",
    "epcgLicNo": {
      "lic1": "LIC001",
      "lic2": "LIC002",
      "lic3": "LIC003"
    },
    "epcgLicDate": "2024-01-01T00:00:00.000Z",
    "epcgLicExpiryReminder": "2025-01-01T00:00:00.000Z",
    "isActive": false,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 2.5 Delete Debit Party
**DELETE** `/debit-parties/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Debit party deleted successfully"
}
```

### 2.6 Search Debit Party by Name
**GET** `/debit-parties/search/name/:partyName`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "partyName": "ABC Trading Co",
      "partyAddress1": "123 Main Street",
      "pinCode": "400001",
      "isActive": true
    }
  ]
}
```

### 2.7 Search Debit Party by GST Number
**GET** `/debit-parties/search/gst/:gstNo`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "partyName": "ABC Trading Co",
    "gstNo": "27ABCDE1234F1Z5",
    "isActive": true
  }
}
```

---

## 3. Item Master APIs

### 3.1 Create Item
**POST** `/master-data/items`

**Request Body:**
```json
{
  "itemName": "Cotton Fabric",
  "itemHsn": "5208",
  "itemQty": 100,
  "itemUnits": "sqm",
  "itemRate": {
    "inr": 150,
    "usd": 2.5
  },
  "remarks": "Premium quality cotton fabric",
  "customField1": "Custom Value 1"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "itemName": "Cotton Fabric",
    "itemHsn": "5208",
    "itemQty": 100,
    "itemUnits": "sqm",
    "itemRate": {
      "inr": 150,
      "usd": 2.5
    },
    "remarks": "Premium quality cotton fabric",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "customField1": "Custom Value 1"
  }
}
```

### 3.2 Get All Items
**GET** `/master-data/items?page=1&limit=10&search=cotton&isActive=true`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in itemName, itemHsn
- `isActive` (optional): Filter by active status (true/false)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "itemName": "Cotton Fabric",
      "itemHsn": "5208",
      "itemQty": 100,
      "itemUnits": "sqm",
      "itemRate": {
        "inr": 150,
        "usd": 2.5
      },
      "isActive": true,
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
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
    "itemsPerPage": 10
  }
}
```

### 3.3 Get Item by ID
**GET** `/master-data/items/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "itemName": "Cotton Fabric",
    "itemHsn": "5208",
    "itemQty": 100,
    "itemUnits": "sqm",
    "itemRate": {
      "inr": 150,
      "usd": 2.5
    },
    "remarks": "Premium quality cotton fabric",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3.4 Update Item
**PUT** `/master-data/items/:id`

**Request Body:**
```json
{
  "itemName": "Premium Cotton Fabric",
  "itemQty": 150,
  "itemRate": {
    "inr": 180,
    "usd": 3.0
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "itemName": "Premium Cotton Fabric",
    "itemHsn": "5208",
    "itemQty": 150,
    "itemUnits": "sqm",
    "itemRate": {
      "inr": 180,
      "usd": 3.0
    },
    "remarks": "Premium quality cotton fabric",
    "isActive": true,
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 3.5 Delete Item
**DELETE** `/master-data/items/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

## 4. Credit Party Master APIs

### 4.1 Create Credit Party
**POST** `/master-data/credit-parties`

**Request Body:**
```json
{
  "partyName": "XYZ International Ltd",
  "partyAddress1": "456 Export Street",
  "partyAddress2": "Floor 5",
  "partyAddress3": "Export Zone",
  "pinCode": "500001",
  "country": "United States",
  "port": "New York",
  "customField1": "Custom Value 1"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Credit party created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "partyName": "XYZ International Ltd",
    "partyAddress1": "456 Export Street",
    "partyAddress2": "Floor 5",
    "partyAddress3": "Export Zone",
    "pinCode": "500001",
    "country": "United States",
    "port": "New York",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "customField1": "Custom Value 1"
  }
}
```

### 4.2 Get All Credit Parties
**GET** `/master-data/credit-parties?page=1&limit=10&search=XYZ&isActive=true`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in partyName, country, port
- `isActive` (optional): Filter by active status (true/false)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "partyName": "XYZ International Ltd",
      "partyAddress1": "456 Export Street",
      "country": "United States",
      "port": "New York",
      "isActive": true,
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
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
    "itemsPerPage": 10
  }
}
```

### 4.3 Get Credit Party by ID
**GET** `/master-data/credit-parties/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "partyName": "XYZ International Ltd",
    "partyAddress1": "456 Export Street",
    "partyAddress2": "Floor 5",
    "partyAddress3": "Export Zone",
    "pinCode": "500001",
    "country": "United States",
    "port": "New York",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4.4 Update Credit Party
**PUT** `/master-data/credit-parties/:id`

**Request Body:**
```json
{
  "partyName": "XYZ International Ltd Updated",
  "country": "Canada",
  "port": "Toronto"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Credit party updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "partyName": "XYZ International Ltd Updated",
    "partyAddress1": "456 Export Street",
    "partyAddress2": "Floor 5",
    "partyAddress3": "Export Zone",
    "pinCode": "500001",
    "country": "Canada",
    "port": "Toronto",
    "isActive": true,
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 4.5 Delete Credit Party
**DELETE** `/master-data/credit-parties/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Credit party deleted successfully"
}
```

---

## 5. Broker Master APIs

### 5.1 Create Broker
**POST** `/master-data/brokers`

**Request Body:**
```json
{
  "brokerName": "Global Brokers Ltd",
  "customField1": "Custom Value 1"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Broker created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "brokerName": "Global Brokers Ltd",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "customField1": "Custom Value 1"
  }
}
```

### 5.2 Get All Brokers
**GET** `/master-data/brokers?page=1&limit=10&search=Global&isActive=true`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in brokerName
- `isActive` (optional): Filter by active status (true/false)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "brokerName": "Global Brokers Ltd",
      "isActive": true,
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
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
    "itemsPerPage": 10
  }
}
```

### 5.3 Get Broker by ID
**GET** `/master-data/brokers/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "brokerName": "Global Brokers Ltd",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5.4 Update Broker
**PUT** `/master-data/brokers/:id`

**Request Body:**
```json
{
  "brokerName": "Global Brokers Ltd Updated",
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Broker updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "brokerName": "Global Brokers Ltd Updated",
    "isActive": false,
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 5.5 Delete Broker
**DELETE** `/master-data/brokers/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Broker deleted successfully"
}
```

---

## 6. CHA Master APIs

### 6.1 Create CHA
**POST** `/master-data/chas`

**Request Body:**
```json
{
  "chaName": "Customs House Agent Ltd",
  "customField1": "Custom Value 1"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "CHA created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "chaName": "Customs House Agent Ltd",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "customField1": "Custom Value 1"
  }
}
```

### 6.2 Get All CHAs
**GET** `/master-data/chas?page=1&limit=10&search=Customs&isActive=true`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in chaName
- `isActive` (optional): Filter by active status (true/false)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
      "chaName": "Customs House Agent Ltd",
      "isActive": true,
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
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
    "itemsPerPage": 10
  }
}
```

### 6.3 Get CHA by ID
**GET** `/master-data/chas/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "chaName": "Customs House Agent Ltd",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 6.4 Update CHA
**PUT** `/master-data/chas/:id`

**Request Body:**
```json
{
  "chaName": "Customs House Agent Ltd Updated",
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "CHA updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "chaName": "Customs House Agent Ltd Updated",
    "isActive": false,
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 6.5 Delete CHA
**DELETE** `/master-data/chas/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "CHA deleted successfully"
}
```

---

## 7. Error Responses

### 7.1 Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Party name is required",
    "Pin code must be exactly 6 digits",
    "GST number format is invalid"
  ]
}
```

### 7.2 Duplicate Key Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Party with this name already exists"
}
```

### 7.3 Not Found Error (404 Not Found)
```json
{
  "success": false,
  "message": "Debit party not found"
}
```

### 7.4 Unauthorized Error (401 Unauthorized)
```json
{
  "success": false,
  "message": "Access denied. No token provided"
}
```

### 7.5 Internal Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 8. Data Models

### 8.1 Debit Party Schema
```javascript
{
  partyName: String (required, unique),
  partyAddress1: String (required),
  partyAddress2: String (optional),
  partyAddress3: String (optional),
  pinCode: String (required, 6-digit validation),
  gstNo: String (optional, GST format validation),
  panNo: String (optional, PAN format validation),
  iecNo: String (optional),
  epcgLicNo: {
    lic1: String,
    lic2: String,
    lic3: String
  },
  epcgLicDate: Date,
  epcgLicExpiryReminder: Date,
  isActive: Boolean (default: true),
  createdBy: ObjectId (User reference),
  updatedBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

### 8.2 Item Schema
```javascript
{
  itemName: String (required, unique),
  itemHsn: String (required),
  itemQty: Number (required),
  itemUnits: String (required, enum: mtr, sqm, kg, pcs, ltr, box, carton, dozen, pair, set, unit),
  itemRate: {
    inr: Number,
    usd: Number
  },
  remarks: String (optional),
  isActive: Boolean (default: true),
  createdBy: ObjectId (User reference),
  updatedBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

### 8.3 Credit Party Schema
```javascript
{
  partyName: String (required, unique),
  partyAddress1: String (required),
  partyAddress2: String (optional),
  partyAddress3: String (optional),
  pinCode: String (required, 6-digit validation),
  country: String (required),
  port: String (required),
  isActive: Boolean (default: true),
  createdBy: ObjectId (User reference),
  updatedBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

### 8.4 Broker Schema
```javascript
{
  brokerName: String (required, unique),
  isActive: Boolean (default: true),
  createdBy: ObjectId (User reference),
  updatedBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

### 8.5 CHA Schema
```javascript
{
  chaName: String (required, unique),
  isActive: Boolean (default: true),
  createdBy: ObjectId (User reference),
  updatedBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 9. Features

### 9.1 Flexible Schema Design
- All models use `strict: false` to allow additional custom fields
- Users can add their own schema keys without modifying the base models

### 9.2 Comprehensive Validation
- Mongoose validation for all required fields
- Format validation for GST, PAN, PIN codes
- Enum validation for status fields and units
- Unique constraints where needed

### 9.3 Search and Filtering
- Full-text search across relevant fields
- Pagination support with customizable page size
- Active/inactive filtering
- Date range filtering for transactions

### 9.4 Audit Trail
- All models track who created and updated records
- Timestamps for creation and updates
- User references for accountability

### 9.5 Relationship Management
- Proper references between models
- Population of related data
- Cascade considerations for deletions

### 9.6 Error Handling
- Comprehensive validation error handling
- Duplicate key error handling
- Proper HTTP status codes
- User-friendly error messages

---

## 10. Usage Examples

### 10.1 Complete API Flow Example

1. **Register User:**
```bash
POST /auth/signup
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

2. **Login to Get Token:**
```bash
POST /auth/login
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

3. **Create Debit Party (with token):**
```bash
POST /debit-parties
Authorization: Bearer <token>
{
  "partyName": "ABC Trading Co",
  "partyAddress1": "123 Main Street",
  "pinCode": "400001"
}
```

4. **Create Item (with token):**
```bash
POST /master-data/items
Authorization: Bearer <token>
{
  "itemName": "Cotton Fabric",
  "itemHsn": "5208",
  "itemQty": 100,
  "itemUnits": "sqm",
  "itemRate": {
    "inr": 150,
    "usd": 2.5
  }
}
```

5. **Search and Filter:**
```bash
GET /debit-parties?search=ABC&page=1&limit=5&isActive=true
Authorization: Bearer <token>
```

### 10.2 Custom Fields Example
```json
{
  "partyName": "ABC Trading Co",
  "partyAddress1": "123 Main Street",
  "pinCode": "400001",
  "customField1": "Custom Value 1",
  "customField2": "Custom Value 2",
  "businessType": "Wholesale",
  "contactPerson": "John Smith",
  "phoneNumber": "+91-9876543210"
}
```

---

## 11. Security Features

- All endpoints require authentication (except auth endpoints)
- JWT token validation with 7-day expiration
- User-based access control
- Input sanitization and validation
- SQL injection prevention through Mongoose
- CORS enabled for cross-origin requests

## 12. Performance Optimizations

- Database indexes on frequently queried fields
- Pagination to handle large datasets
- Efficient population of related data
- Optimized search queries with regex
- Response caching considerations

---

This comprehensive API documentation provides all the information needed to integrate with the Master Data Management System, including request/response formats, authentication, error handling, and usage examples.
