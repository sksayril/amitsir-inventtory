# User Authentication & Company Master API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. User Registration (Signup)

**Endpoint:** `POST /auth/signup`

**Description:** Register a new user account

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Request Headers:**
```
Content-Type: application/json
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": null,
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name must be at least 2 characters long",
    "Please enter a valid email address",
    "Password must be at least 6 characters long"
  ]
}
```

**Error Response (400) - Email Already Exists:**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get access token

**Access:** Public

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Request Headers:**
```
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2023-09-06T10:35:00.000Z",
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:35:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400) - Missing Fields:**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**Error Response (401) - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Error Response (401) - Account Deactivated:**
```json
{
  "success": false,
  "message": "Account is deactivated"
}
```

---

### 3. Get Current User Profile

**Endpoint:** `GET /auth/me`

**Description:** Get current authenticated user's profile

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2023-09-06T10:35:00.000Z",
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:35:00.000Z"
    }
  }
}
```

**Error Response (401) - No Token:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Error Response (401) - Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid token."
}
```

**Error Response (401) - Token Expired:**
```json
{
  "success": false,
  "message": "Token expired."
}
```

---

### 4. Update User Profile

**Endpoint:** `PUT /auth/profile`

**Description:** Update current user's profile information

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2023-09-06T10:35:00.000Z",
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:40:00.000Z"
    }
  }
}
```

**Error Response (400) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name must be at least 2 characters long",
    "Please enter a valid email address"
  ]
}
```

**Error Response (400) - Email Already Exists:**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 5. User Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout user (client-side token removal)

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Management Endpoints (Admin Only)

### 6. Get All Users

**Endpoint:** `GET /users`

**Description:** Get list of all users (Admin only)

**Access:** Private/Admin

**Request Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2023-09-06T10:35:00.000Z",
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:35:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true,
      "lastLogin": "2023-09-06T09:30:00.000Z",
      "createdAt": "2023-09-06T09:00:00.000Z",
      "updatedAt": "2023-09-06T09:30:00.000Z"
    }
  ]
}
```

**Error Response (403) - Not Admin:**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

### 7. Get User by ID

**Endpoint:** `GET /users/:id`

**Description:** Get specific user by ID (Users can only access their own profile unless admin)

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: User ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "isActive": true,
    "lastLogin": "2023-09-06T10:35:00.000Z",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:35:00.000Z"
  }
}
```

**Error Response (400) - Invalid ID:**
```json
{
  "success": false,
  "message": "Invalid user ID"
}
```

**Error Response (403) - Access Denied:**
```json
{
  "success": false,
  "message": "Access denied"
}
```

**Error Response (404) - User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 8. Update User (Admin Only)

**Endpoint:** `PUT /users/:id`

**Description:** Update user information (Admin only)

**Access:** Private/Admin

**Request Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: User ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin",
  "isActive": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "admin",
    "isActive": false,
    "lastLogin": "2023-09-06T10:35:00.000Z",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:45:00.000Z"
  }
}
```

**Error Response (400) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name must be at least 2 characters long",
    "Please enter a valid email address"
  ]
}
```

**Error Response (400) - Email Already Exists:**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 9. Delete User (Admin Only)

**Endpoint:** `DELETE /users/:id`

**Description:** Delete user account (Admin only)

**Access:** Private/Admin

**Request Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: User ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Response (400) - Invalid ID:**
```json
{
  "success": false,
  "message": "Invalid user ID"
}
```

**Error Response (404) - User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Company Master Endpoints

### 10. Create Company

**Endpoint:** `POST /companies`

**Description:** Create a new company master record

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firmId": "FIRM001",
  "companyName": "ABC Corporation Ltd",
  "firmAddress1": "123 Main Street",
  "firmAddress2": "Building A, Floor 2",
  "firmAddress3": "Business District",
  "pinCode": "400001",
  "gstNo": "27ABCDE1234F1Z5",
  "panNo": "ABCDE1234F",
  "contactNo": "9876543210",
  "emailId": "info@abccorp.com"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Company created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "firmId": "FIRM001",
    "companyName": "ABC Corporation Ltd",
    "firmAddress1": "123 Main Street",
    "firmAddress2": "Building A, Floor 2",
    "firmAddress3": "Business District",
    "pinCode": "400001",
    "gstNo": "27ABCDE1234F1Z5",
    "panNo": "ABCDE1234F",
    "contactNo": "9876543210",
    "emailId": "info@abccorp.com",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2023-09-06T11:00:00.000Z",
    "updatedAt": "2023-09-06T11:00:00.000Z"
  }
}
```

**Error Response (400) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "FIRM ID is required",
    "Please enter a valid 6-digit PIN code",
    "Please enter a valid GST number",
    "Please enter a valid PAN number",
    "Please enter a valid 10-digit contact number"
  ]
}
```

**Error Response (400) - Duplicate FIRM ID:**
```json
{
  "success": false,
  "message": "Company with this FIRM ID already exists"
}
```

**Error Response (400) - Duplicate GST:**
```json
{
  "success": false,
  "message": "Company with this GST Number already exists"
}
```

**Error Response (400) - Duplicate PAN:**
```json
{
  "success": false,
  "message": "Company with this PAN Number already exists"
}
```

**Error Response (400) - Duplicate Email:**
```json
{
  "success": false,
  "message": "Company with this Email ID already exists"
}
```

---

### 11. Get All Companies

**Endpoint:** `GET /companies`

**Description:** Get all companies with pagination and search

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term (searches in firmId, companyName, gstNo, panNo, emailId)
- `isActive`: Filter by active status (true/false)

**Example Request:**
```
GET /companies?page=1&limit=5&search=ABC&isActive=true
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "firmId": "FIRM001",
      "companyName": "ABC Corporation Ltd",
      "firmAddress1": "123 Main Street",
      "firmAddress2": "Building A, Floor 2",
      "firmAddress3": "Business District",
      "pinCode": "400001",
      "gstNo": "27ABCDE1234F1Z5",
      "panNo": "ABCDE1234F",
      "contactNo": "9876543210",
      "emailId": "info@abccorp.com",
      "isActive": true,
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "createdAt": "2023-09-06T11:00:00.000Z",
      "updatedAt": "2023-09-06T11:00:00.000Z"
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

### 12. Get Company by ID

**Endpoint:** `GET /companies/:id`

**Description:** Get specific company by ID

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Company ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "firmId": "FIRM001",
    "companyName": "ABC Corporation Ltd",
    "firmAddress1": "123 Main Street",
    "firmAddress2": "Building A, Floor 2",
    "firmAddress3": "Business District",
    "pinCode": "400001",
    "gstNo": "27ABCDE1234F1Z5",
    "panNo": "ABCDE1234F",
    "contactNo": "9876543210",
    "emailId": "info@abccorp.com",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2023-09-06T11:00:00.000Z",
    "updatedAt": "2023-09-06T11:30:00.000Z"
  }
}
```

**Error Response (400) - Invalid ID:**
```json
{
  "success": false,
  "message": "Invalid company ID"
}
```

**Error Response (404) - Company Not Found:**
```json
{
  "success": false,
  "message": "Company not found"
}
```

---

### 13. Update Company

**Endpoint:** `PUT /companies/:id`

**Description:** Update company information

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Company ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "firmId": "FIRM001",
  "companyName": "ABC Corporation Ltd - Updated",
  "firmAddress1": "456 New Street",
  "firmAddress2": "Building B, Floor 3",
  "firmAddress3": "Tech Park",
  "pinCode": "400002",
  "gstNo": "27ABCDE1234F1Z5",
  "panNo": "ABCDE1234F",
  "contactNo": "9876543211",
  "emailId": "contact@abccorp.com",
  "isActive": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Company updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "firmId": "FIRM001",
    "companyName": "ABC Corporation Ltd - Updated",
    "firmAddress1": "456 New Street",
    "firmAddress2": "Building B, Floor 3",
    "firmAddress3": "Tech Park",
    "pinCode": "400002",
    "gstNo": "27ABCDE1234F1Z5",
    "panNo": "ABCDE1234F",
    "contactNo": "9876543211",
    "emailId": "contact@abccorp.com",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2023-09-06T11:00:00.000Z",
    "updatedAt": "2023-09-06T11:30:00.000Z"
  }
}
```

**Error Response (400) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Please enter a valid 6-digit PIN code",
    "Please enter a valid GST number"
  ]
}
```

**Error Response (400) - Duplicate FIRM ID:**
```json
{
  "success": false,
  "message": "Company with this FIRM ID already exists"
}
```

---

### 14. Delete Company

**Endpoint:** `DELETE /companies/:id`

**Description:** Delete company record

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Company ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Company deleted successfully"
}
```

**Error Response (400) - Invalid ID:**
```json
{
  "success": false,
  "message": "Invalid company ID"
}
```

**Error Response (404) - Company Not Found:**
```json
{
  "success": false,
  "message": "Company not found"
}
```

---

### 15. Search Company by FIRM ID

**Endpoint:** `GET /companies/search/firm-id/:firmId`

**Description:** Search company by FIRM ID

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `firmId`: FIRM ID to search for

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "firmId": "FIRM001",
    "companyName": "ABC Corporation Ltd",
    "firmAddress1": "123 Main Street",
    "firmAddress2": "Building A, Floor 2",
    "firmAddress3": "Business District",
    "pinCode": "400001",
    "gstNo": "27ABCDE1234F1Z5",
    "panNo": "ABCDE1234F",
    "contactNo": "9876543210",
    "emailId": "info@abccorp.com",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2023-09-06T11:00:00.000Z",
    "updatedAt": "2023-09-06T11:00:00.000Z"
  }
}
```

**Error Response (404) - Company Not Found:**
```json
{
  "success": false,
  "message": "Company not found"
}
```

---

### 16. Search Company by GST Number

**Endpoint:** `GET /companies/search/gst/:gstNo`

**Description:** Search company by GST Number

**Access:** Private

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `gstNo`: GST Number to search for

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "firmId": "FIRM001",
    "companyName": "ABC Corporation Ltd",
    "firmAddress1": "123 Main Street",
    "firmAddress2": "Building A, Floor 2",
    "firmAddress3": "Business District",
    "pinCode": "400001",
    "gstNo": "27ABCDE1234F1Z5",
    "panNo": "ABCDE1234F",
    "contactNo": "9876543210",
    "emailId": "info@abccorp.com",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "createdAt": "2023-09-06T11:00:00.000Z",
    "updatedAt": "2023-09-06T11:00:00.000Z"
  }
}
```

**Error Response (404) - Company Not Found:**
```json
{
  "success": false,
  "message": "Company not found"
}
```

---

## Data Models

### User Schema
```javascript
{
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Company Schema
```javascript
{
  firmId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    minlength: 3,
    maxlength: 20
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  firmAddress1: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  firmAddress2: {
    type: String,
    trim: true,
    maxlength: 100
  },
  firmAddress3: {
    type: String,
    trim: true,
    maxlength: 100
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
    match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit PIN code']
  },
  gstNo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number']
  },
  panNo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },
  contactNo: {
    type: String,
    required: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit contact number']
  },
  emailId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation Error |
| 401 | Unauthorized - Authentication Required |
| 403 | Forbidden - Insufficient Permissions |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
```

---

## Testing with cURL

### Register a new user:
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Create a company:
```bash
curl -X POST http://localhost:3000/companies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firmId": "FIRM001",
    "companyName": "ABC Corporation Ltd",
    "firmAddress1": "123 Main Street",
    "firmAddress2": "Building A, Floor 2",
    "firmAddress3": "Business District",
    "pinCode": "400001",
    "gstNo": "27ABCDE1234F1Z5",
    "panNo": "ABCDE1234F",
    "contactNo": "9876543210",
    "emailId": "info@abccorp.com"
  }'
```

### Get all companies:
```bash
curl -X GET "http://localhost:3000/companies?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get company by ID:
```bash
curl -X GET http://localhost:3000/companies/COMPANY_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Update company:
```bash
curl -X PUT http://localhost:3000/companies/COMPANY_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "ABC Corporation Ltd - Updated",
    "firmAddress1": "456 New Street",
    "pinCode": "400002"
  }'
```

### Delete company:
```bash
curl -X DELETE http://localhost:3000/companies/COMPANY_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Search company by FIRM ID:
```bash
curl -X GET http://localhost:3000/companies/search/firm-id/FIRM001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Search company by GST:
```bash
curl -X GET http://localhost:3000/companies/search/gst/27ABCDE1234F1Z5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Validation Rules

### Company Master Validation:
1. **FIRM ID**: Required, unique, 3-20 characters, uppercase
2. **Company Name**: Required, max 100 characters
3. **Firm Address 1**: Required, max 100 characters
4. **Firm Address 2 & 3**: Optional, max 100 characters each
5. **PIN Code**: Required, 6-digit number starting with non-zero
6. **GST Number**: Required, unique, valid GST format (27ABCDE1234F1Z5)
7. **PAN Number**: Required, unique, valid PAN format (ABCDE1234F)
8. **Contact Number**: Required, 10-digit mobile number starting with 6-9
9. **Email ID**: Required, unique, valid email format

### GST Number Format:
- 2 digits (State code)
- 5 letters (Entity code)
- 4 digits (Entity number)
- 1 letter (Entity type)
- 1 letter/digit (Check sum)
- 1 letter (Fixed 'Z')
- 1 letter/digit (Check sum)

### PAN Number Format:
- 5 letters (Entity code)
- 4 digits (Entity number)
- 1 letter (Entity type)

---

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
2. **JWT Authentication**: Secure token-based authentication with 7-day expiration
3. **Input Validation**: Comprehensive Mongoose validation for all inputs
4. **Role-based Access Control**: Admin and user roles with appropriate permissions
5. **Account Status**: Users can be deactivated without deletion
6. **Email Uniqueness**: Enforced unique email addresses across the system
7. **Token Security**: JWT tokens are verified on every protected request
8. **Company Data Integrity**: Unique constraints on FIRM ID, GST, PAN, and Email
9. **Audit Trail**: Track who created and updated company records

---

## Rate Limiting & Security Recommendations

1. **Rate Limiting**: Implement rate limiting for login attempts
2. **Password Policy**: Enforce strong password requirements
3. **HTTPS**: Use HTTPS in production
4. **CORS**: Configure CORS properly for your frontend domain
5. **Helmet**: Use security middleware like helmet
6. **Input Sanitization**: Sanitize all user inputs
7. **Logging**: Implement proper logging for security events
8. **Data Encryption**: Encrypt sensitive company data at rest
9. **API Versioning**: Implement API versioning for future updates
