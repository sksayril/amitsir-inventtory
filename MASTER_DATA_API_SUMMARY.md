# Master Data API Summary

## Overview
This document summarizes all the master data models and APIs created for the comprehensive business management system.

## Models Created

### 1. Debit Party Master (`models/debitParty.model.js`)
**Fields:**
- `partyName` (required, unique)
- `partyAddress1` (required)
- `partyAddress2` (optional)
- `partyAddress3` (optional)
- `pinCode` (required, 6-digit validation)
- `gstNo` (optional, GST format validation)
- `panNo` (optional, PAN format validation)
- `iecNo` (optional)
- `epcgLicNo` (object with lic1, lic2, lic3)
- `epcgLicDate` (Date)
- `epcgLicExpiryReminder` (Date)
- `isActive` (Boolean, default: true)
- `createdBy`, `updatedBy` (User references)
- `timestamps` (createdAt, updatedAt)
- `strict: false` (allows additional custom fields)

### 2. Item Master (`models/item.model.js`)
**Fields:**
- `itemName` (required, unique)
- `itemHsn` (required)
- `itemQty` (required, number)
- `itemUnits` (required, enum: mtr, sqm, kg, pcs, ltr, box, carton, dozen, pair, set, unit)
- `itemRate` (object with inr, usd)
- `remarks` (optional)
- `isActive` (Boolean, default: true)
- `createdBy`, `updatedBy` (User references)
- `timestamps` (createdAt, updatedAt)
- `strict: false` (allows additional custom fields)

### 3. Credit Party Master (`models/creditParty.model.js`)
**Fields:**
- `partyName` (required, unique)
- `partyAddress1` (required)
- `partyAddress2` (optional)
- `partyAddress3` (optional)
- `pinCode` (required, 6-digit validation)
- `country` (required)
- `port` (required)
- `isActive` (Boolean, default: true)
- `createdBy`, `updatedBy` (User references)
- `timestamps` (createdAt, updatedAt)
- `strict: false` (allows additional custom fields)

### 4. Broker Master (`models/broker.model.js`)
**Fields:**
- `brokerName` (required, unique)
- `isActive` (Boolean, default: true)
- `createdBy`, `updatedBy` (User references)
- `timestamps` (createdAt, updatedAt)
- `strict: false` (allows additional custom fields)

### 5. CHA Master (`models/cha.model.js`)
**Fields:**
- `chaName` (required, unique)
- `isActive` (Boolean, default: true)
- `createdBy`, `updatedBy` (User references)
- `timestamps` (createdAt, updatedAt)
- `strict: false` (allows additional custom fields)

### 6. Sales Transaction (`models/salesTransaction.model.js`)
**Fields:**
- `transactionNumber` (required, unique)
- `transactionDate` (required, default: now)
- `debitParty` (required, reference to DebitParty)
- `creditParty` (required, reference to CreditParty)
- `items` (array of items with quantity, rate, amount)
- `totalAmount` (required, number)
- `currency` (enum: INR, USD, EUR, GBP)
- `broker` (optional, reference to Broker)
- `cha` (optional, reference to CHA)
- `status` (enum: draft, pending, approved, completed, cancelled)
- `remarks` (optional)
- `isActive` (Boolean, default: true)
- `createdBy`, `updatedBy` (User references)
- `timestamps` (createdAt, updatedAt)
- `strict: false` (allows additional custom fields)

### 7. Purchase Transaction (`models/purchaseTransaction.model.js`)
**Fields:** (Same structure as Sales Transaction)

### 8. Receipt Transaction (`models/receiptTransaction.model.js`)
**Fields:**
- `transactionNumber` (required, unique)
- `transactionDate` (required, default: now)
- `party` (required, reference to DebitParty)
- `partyType` (enum: debit, credit)
- `amount` (required, number)
- `currency` (enum: INR, USD, EUR, GBP)
- `paymentMode` (enum: cash, cheque, bank_transfer, online, card)
- `referenceNumber` (optional)
- `bankDetails` (object with bankName, accountNumber, ifscCode)
- `status` (enum: pending, completed, failed, cancelled)
- `remarks` (optional)
- `isActive` (Boolean, default: true)
- `createdBy`, `updatedBy` (User references)
- `timestamps` (createdAt, updatedAt)
- `strict: false` (allows additional custom fields)

## API Endpoints Created

### Debit Party APIs (`/debit-parties`)
- `POST /debit-parties` - Create debit party
- `GET /debit-parties` - Get all debit parties (with pagination, search, filtering)
- `GET /debit-parties/:id` - Get debit party by ID
- `PUT /debit-parties/:id` - Update debit party
- `DELETE /debit-parties/:id` - Delete debit party
- `GET /debit-parties/search/name/:partyName` - Search by party name
- `GET /debit-parties/search/gst/:gstNo` - Search by GST number

### Master Data APIs (`/master-data`)

#### Items (`/master-data/items`)
- `POST /master-data/items` - Create item
- `GET /master-data/items` - Get all items (with pagination, search, filtering)
- `GET /master-data/items/:id` - Get item by ID
- `PUT /master-data/items/:id` - Update item
- `DELETE /master-data/items/:id` - Delete item

#### Credit Parties (`/master-data/credit-parties`)
- `POST /master-data/credit-parties` - Create credit party
- `GET /master-data/credit-parties` - Get all credit parties (with pagination, search, filtering)
- `GET /master-data/credit-parties/:id` - Get credit party by ID
- `PUT /master-data/credit-parties/:id` - Update credit party
- `DELETE /master-data/credit-parties/:id` - Delete credit party

#### Brokers (`/master-data/brokers`)
- `POST /master-data/brokers` - Create broker
- `GET /master-data/brokers` - Get all brokers (with pagination, search, filtering)
- `GET /master-data/brokers/:id` - Get broker by ID
- `PUT /master-data/brokers/:id` - Update broker
- `DELETE /master-data/brokers/:id` - Delete broker

#### CHAs (`/master-data/chas`)
- `POST /master-data/chas` - Create CHA
- `GET /master-data/chas` - Get all CHAs (with pagination, search, filtering)
- `GET /master-data/chas/:id` - Get CHA by ID
- `PUT /master-data/chas/:id` - Update CHA
- `DELETE /master-data/chas/:id` - Delete CHA

## Key Features

### 1. Flexible Schema Design
- All models use `strict: false` to allow additional custom fields
- Users can add their own schema keys without modifying the base models

### 2. Comprehensive Validation
- Mongoose validation for all required fields
- Format validation for GST, PAN, PIN codes
- Enum validation for status fields and units
- Unique constraints where needed

### 3. Search and Filtering
- Full-text search across relevant fields
- Pagination support
- Active/inactive filtering
- Date range filtering for transactions

### 4. Audit Trail
- All models track who created and updated records
- Timestamps for creation and updates
- User references for accountability

### 5. Relationship Management
- Proper references between models
- Population of related data
- Cascade considerations for deletions

### 6. Error Handling
- Comprehensive validation error handling
- Duplicate key error handling
- Proper HTTP status codes
- User-friendly error messages

## Usage Examples

### Creating a Debit Party with Custom Fields
```json
{
  "partyName": "ABC Trading Co",
  "partyAddress1": "123 Main Street",
  "pinCode": "400001",
  "gstNo": "27ABCDE1234F1Z5",
  "customField1": "Custom Value 1",
  "customField2": "Custom Value 2"
}
```

### Creating an Item with Rates
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
  "remarks": "Premium quality cotton"
}
```

### Creating a Sales Transaction
```json
{
  "transactionNumber": "SALES001",
  "debitParty": "debitPartyId",
  "creditParty": "creditPartyId",
  "items": [
    {
      "item": "itemId",
      "quantity": 10,
      "rate": 150,
      "amount": 1500
    }
  ],
  "totalAmount": 1500,
  "currency": "INR",
  "broker": "brokerId",
  "cha": "chaId"
}
```

## Security Features
- All endpoints require authentication
- JWT token validation
- User-based access control
- Input sanitization and validation
- SQL injection prevention through Mongoose

## Performance Optimizations
- Database indexes on frequently queried fields
- Pagination to handle large datasets
- Efficient population of related data
- Optimized search queries

This comprehensive master data system provides a solid foundation for business management with flexibility for custom requirements and robust data integrity.
