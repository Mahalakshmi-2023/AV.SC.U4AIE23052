# Stage 1 - Notification System Design

This document defines the REST API contract and system design for a notification platform that allows users to receive, manage, and interact with notifications in real time.

The APIs are designed with predictable naming conventions, structured JSON responses, scalable architecture, and real-time notification delivery support.

---

# Base URL

```txt
http://localhost:5000/api/v1
```

---

# Authentication

All APIs are protected routes.

Clients must send:

```http
Authorization: Bearer <token>
```

---

# Common Headers

## Request Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

---

# Notification Object Structure

```json
{
  "id": "notif_001",
  "title": "New Message",
  "message": "You received a new message from admin",
  "type": "message",
  "read": false,
  "priority": "high",
  "createdAt": "2026-05-06T10:00:00Z"
}
```

---

# API Endpoints

---

# 1. Get All Notifications

## Endpoint

```http
GET /notifications
```

---

## Description

Fetch all notifications for authenticated user.

---

## Request Headers

```http
Authorization: Bearer <token>
```

---

## Query Parameters

| Parameter | Type | Description |
|----------|------|-------------|
| page | number | Current page |
| limit | number | Items per page |
| read | boolean | Filter read/unread |
| type | string | Filter notification type |

---

## Example Request

```http
GET /api/v1/notifications?page=1&limit=10&read=false
```

---

## Success Response

### Status Code

```http
200 OK
```

---

## Response Body

```json
{
  "success": true,
  "count": 2,
  "notifications": [
    {
      "id": "notif_001",
      "title": "Welcome",
      "message": "Welcome to the platform",
      "type": "system",
      "read": false,
      "priority": "medium",
      "createdAt": "2026-05-06T10:00:00Z"
    },
    {
      "id": "notif_002",
      "title": "New Message",
      "message": "You received a new message",
      "type": "message",
      "read": true,
      "priority": "high",
      "createdAt": "2026-05-06T10:10:00Z"
    }
  ]
}
```

---

# 2. Get Single Notification

## Endpoint

```http
GET /notifications/:id
```

---

## Description

Fetch notification details using notification ID.

---

## Example Request

```http
GET /api/v1/notifications/notif_001
```

---

## Success Response

### Status Code

```http
200 OK
```

---

## Response Body

```json
{
  "success": true,
  "notification": {
    "id": "notif_001",
    "title": "New Message",
    "message": "You received a new message",
    "type": "message",
    "read": false,
    "priority": "high",
    "createdAt": "2026-05-06T10:00:00Z"
  }
}
```

---

# 3. Create Notification

## Endpoint

```http
POST /notifications
```

---

## Description

Create a new notification.

---

## Request Body

```json
{
  "title": "Server Maintenance",
  "message": "Server will be down tonight",
  "type": "system",
  "priority": "high"
}
```

---

## Success Response

### Status Code

```http
201 Created
```

---

## Response Body

```json
{
  "success": true,
  "message": "Notification created successfully",
  "notificationId": "notif_003"
}
```

---

# 4. Mark Notification as Read

## Endpoint

```http
PATCH /notifications/:id/read
```

---

## Description

Mark notification as read.

---

## Success Response

### Status Code

```http
200 OK
```

---

## Response Body

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

# 5. Delete Notification

## Endpoint

```http
DELETE /notifications/:id
```

---

## Description

Delete notification using ID.

---

## Success Response

### Status Code

```http
200 OK
```

---

## Response Body

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

# 6. Mark All Notifications as Read

## Endpoint

```http
PATCH /notifications/read-all
```

---

## Description

Marks all notifications as read for authenticated user.

---

## Success Response

### Status Code

```http
200 OK
```

---

## Response Body

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

# Error Response Structure

## Example Error Response

```json
{
  "success": false,
  "error": "Notification not found"
}
```

---

# Standard Status Codes

| Status Code | Meaning |
|-------------|----------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

# Real-Time Notification Mechanism

# Technology Used

```txt
WebSocket / Socket.IO
```

---

# Real-Time Flow

1. User logs into application
2. Client establishes WebSocket connection
3. Server pushes notifications instantly
4. Frontend updates UI in real time
5. Unread count updates dynamically

---

# WebSocket Event Example

## Server Event

```json
{
  "event": "new_notification",
  "data": {
    "id": "notif_005",
    "title": "Payment Received",
    "message": "Your payment was successful"
  }
}
```

---

# Notification Types

| Type | Description |
|------|-------------|
| system | System generated notifications |
| alert | Security alerts |
| message | User messages |
| reminder | Reminder notifications |

---

# Security Considerations

- JWT authentication required
- Protected API routes
- Input validation
- Rate limiting
- Secure WebSocket communication
- User-specific notification access

---

# Scalability Considerations

- Pagination support
- Indexed database queries
- Event-driven architecture
- WebSocket connection management
- Redis caching for unread counts

---

# Database Design

## notifications table

| Field | Type |
|------|------|
| id | string |
| userId | string |
| title | string |
| message | text |
| type | string |
| read | boolean |
| priority | string |
| createdAt | timestamp |

---

# Conclusion

The notification system is designed with scalable REST APIs, structured JSON contracts, predictable endpoints, and real-time communication support. The architecture ensures maintainability, extensibility, and efficient notification delivery for modern applications.

---

# Stage 2 - Database Design & Storage Architecture

# Database Choice

## Selected Database

```txt
MongoDB (NoSQL Database)
```

---

# Why MongoDB?

MongoDB is selected because notification systems generate large volumes of semi-structured and real-time data. MongoDB provides:

- High write performance
- Flexible schema design
- Horizontal scalability
- Fast querying for unread notifications
- Efficient handling of real-time notification streams
- Easy integration with Node.js applications

Since notification payloads may evolve over time with additional metadata, a NoSQL database is more suitable than a rigid relational schema.

---

# Database Collection Design

# notifications Collection

## Schema Structure

```json
{
  "_id": "ObjectId",
  "userId": "user_001",
  "title": "New Message",
  "message": "You received a new message",
  "type": "message",
  "priority": "high",
  "read": false,
  "createdAt": "2026-05-06T10:00:00Z",
  "updatedAt": "2026-05-06T10:00:00Z"
}
```

---

# Field Descriptions

| Field | Type | Description |
|------|------|-------------|
| _id | ObjectId | Unique notification ID |
| userId | string | User identifier |
| title | string | Notification title |
| message | string | Notification content |
| type | string | Notification category |
| priority | string | Priority level |
| read | boolean | Read/unread status |
| createdAt | timestamp | Creation timestamp |
| updatedAt | timestamp | Last update timestamp |

---

# Indexing Strategy

To improve performance, the following indexes are recommended:

```js
db.notifications.createIndex({ userId: 1 })

db.notifications.createIndex({ read: 1 })

db.notifications.createIndex({ createdAt: -1 })

db.notifications.createIndex({
  userId: 1,
  read: 1
})
```

---

# REST API Query Mapping

# 1. Create Notification

## MongoDB Query

```js
db.notifications.insertOne({
  userId: "user_001",
  title: "Server Maintenance",
  message: "Server maintenance tonight",
  type: "system",
  priority: "high",
  read: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

# 2. Get All Notifications

## MongoDB Query

```js
db.notifications.find({
  userId: "user_001"
})
.sort({ createdAt: -1 })
.limit(10)
```

---

# 3. Get Unread Notifications

## MongoDB Query

```js
db.notifications.find({
  userId: "user_001",
  read: false
})
```

---

# 4. Get Notification By ID

## MongoDB Query

```js
db.notifications.findOne({
  _id: ObjectId("6612ab34cd5678ef90123456")
})
```

---

# 5. Mark Notification as Read

## MongoDB Query

```js
db.notifications.updateOne(
  {
    _id: ObjectId("6612ab34cd5678ef90123456")
  },
  {
    $set: {
      read: true,
      updatedAt: new Date()
    }
  }
)
```

---

# 6. Mark All Notifications as Read

## MongoDB Query

```js
db.notifications.updateMany(
  {
    userId: "user_001",
    read: false
  },
  {
    $set: {
      read: true,
      updatedAt: new Date()
    }
  }
)
```

---

# 7. Delete Notification

## MongoDB Query

```js
db.notifications.deleteOne({
  _id: ObjectId("6612ab34cd5678ef90123456")
})
```

---

# Scaling Challenges

As notification volume increases, several challenges may arise.

---

# 1. Large Data Growth

Millions of notifications can increase storage size rapidly.

## Solution

- Archive old notifications
- Apply data retention policies
- Use cloud-based scalable storage

---

# 2. Slow Query Performance

Unread notification queries may become slow.

## Solution

- Proper indexing
- Pagination
- Query optimization

---

# 3. High Concurrent Traffic

Many users receiving notifications simultaneously may overload servers.

## Solution

- Load balancing
- Distributed servers
- Queue-based processing using Kafka or RabbitMQ

---

# 4. Real-Time Delivery Bottlenecks

Large WebSocket connections may consume server resources.

## Solution

- WebSocket clustering
- Redis Pub/Sub
- Scalable event-driven architecture

---

# 5. Database Bottlenecks

Single database instances may become overloaded.

## Solution

- Database sharding
- Horizontal scaling
- Read replicas

---

# Pagination Strategy

Pagination prevents excessive data transfer.

## Example API

```http
GET /notifications?page=1&limit=10
```

---

# Example Backend Logic

```js
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

db.notifications.find()
.sort({ createdAt: -1 })
.skip(skip)
.limit(limit);
```

---

# Data Retention Policy

Old notifications older than 90 days can be archived or deleted automatically.

## Example TTL Index

```js
db.notifications.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 7776000 }
)
```

---

# Security Considerations

- User-specific access control
- JWT authentication
- Encrypted communication using HTTPS
- Input validation and sanitization
- Protection against NoSQL injection

---

# High-Level Architecture

```txt
Client Application
        │
        ▼
API Gateway
        │
        ▼
Notification Service
        │
 ┌───────────────┐
 │ MongoDB       │
 │ Redis Cache   │
 │ WebSocket Hub │
 └───────────────┘
```

---

# Redis Usage

Redis can be used for:

- Caching unread notification counts
- WebSocket session management
- Fast temporary storage
- Pub/Sub messaging

---

# Future Improvements

- Notification analytics
- AI-based notification prioritization
- Multi-device synchronization
- Push notification integration
- Email and SMS integration

---

# Conclusion

MongoDB provides a scalable and flexible solution for handling high-volume notification systems. With proper indexing, pagination, caching, sharding, and real-time communication architecture, the system can efficiently support millions of notifications while maintaining high performance and reliability.