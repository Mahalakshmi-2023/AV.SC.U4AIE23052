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

---

# Stage 3 - SQL Query Optimization & Performance Analysis

# Existing Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

---

# Is This Query Accurate?

Yes, the query is logically correct because it fetches unread notifications for a specific student and sorts them by creation time.

However, the query is not optimized for large-scale datasets.

The database currently contains:

- 50,000 students
- 5,000,000 notifications

At this scale, query optimization becomes extremely important.

---

# Why Is This Query Slow?

Several factors contribute to the slow performance.

---

# 1. Full Table Scan

If proper indexes are not present, the database engine scans millions of rows to find matching records.

This increases query execution time significantly.

---

# 2. Sorting Overhead

The query uses:

```sql
ORDER BY createdAt ASC
```

Sorting large datasets without an optimized index is computationally expensive.

---

# 3. SELECT *

Using:

```sql
SELECT *
```

retrieves all columns unnecessarily.

This increases:

- disk I/O
- memory usage
- network transfer cost

---

# 4. Large Dataset Size

The table contains 5 million records.

Without indexing and pagination, response time degrades rapidly as data grows.

---

# Optimized Query

A more optimized version is:

```sql
SELECT id, title, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;
```

---

# Improvements Made

| Optimization | Benefit |
|---|---|
| Removed SELECT * | Fetches only required columns |
| Added LIMIT | Reduces result size |
| DESC ordering | Fetches latest notifications first |
| Smaller payload | Improves response time |

---

# Recommended Index

The best optimization is a composite index.

## Recommended Composite Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```

---

# Why Composite Index Works Better

The query filters by:

- studentID
- isRead

and sorts by:

- createdAt

The composite index allows the database to:

- quickly locate matching rows
- avoid full table scans
- avoid expensive sorting operations

---

# Computational Cost

## Without Index

Approximate complexity:

```txt
O(N)
```

The database scans millions of rows.

---

# With Composite Index

Approximate complexity:

```txt
O(log N)
```

Index traversal becomes significantly faster.

---

# Should We Add Indexes on Every Column?

No, adding indexes on every column is not an effective strategy.

---

# Problems With Excessive Indexing

| Problem | Explanation |
|---|---|
| Increased storage usage | Each index consumes disk space |
| Slower INSERT operations | All indexes must be updated |
| Slower UPDATE operations | Index maintenance overhead |
| Slower DELETE operations | Index references must be removed |
| Poor optimizer decisions | Too many indexes confuse query planner |

---

# Best Practice for Indexing

Indexes should only be created on:

- frequently filtered columns
- JOIN columns
- sorting columns
- high-frequency search fields

Indexes must be designed based on query patterns.

---

# Query to Find Students Who Received Placement Notifications in Last 7 Days

## Optimized SQL Query

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

---

# Why DISTINCT Is Used

A student may receive multiple placement notifications.

`DISTINCT` ensures unique student IDs are returned.

---

# Recommended Index for Placement Query

```sql
CREATE INDEX idx_notification_type_created
ON notifications(notificationType, createdAt);
```

---

# Pagination Recommendation

Fetching all notifications at once is inefficient.

Pagination should always be implemented.

## Example

```sql
SELECT id, title, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC
LIMIT 20 OFFSET 0;
```

---

# Partitioning Strategy

As notification volume increases further, table partitioning can improve performance.

## Example Partitioning

Partition by:

- createdAt (monthly partitions)
- notificationType
- studentID ranges

---

# Caching Strategy

Frequently accessed unread notification counts can be cached using Redis.

This reduces repeated database hits.

---

# Database Scaling Recommendations

## Read Replicas

Use read replicas for heavy read traffic.

---

## Sharding

Distribute notifications across multiple database servers.

---

## Archiving

Move old notifications to archive tables after a fixed duration.

---

# Final Recommendation

The primary issue is lack of proper indexing and inefficient query design.

The best solution includes:

- composite indexing
- pagination
- limited column selection
- caching
- partitioning
- query optimization

These techniques significantly improve scalability and reduce database load in high-volume notification systems.

---

# Stage 4 - Performance Optimization & Scalability Improvements

# Problem Statement

Currently, notifications are fetched from the database on every page load for every student.

As the number of users and notifications increases, this creates:

- excessive database reads
- high server load
- increased response time
- poor user experience
- scalability bottlenecks

The system requires optimization to reduce unnecessary database access while maintaining real-time responsiveness.

---

# Recommended Solution Architecture

The best approach is to combine multiple optimization strategies instead of relying on a single solution.

Recommended strategies:

1. Redis Caching
2. Pagination
3. Lazy Loading
4. WebSocket-Based Real-Time Updates
5. Read Replicas
6. Notification Count Caching
7. Background Processing

---

# 1. Redis Caching

## Approach

Store frequently accessed notifications and unread counts inside Redis.

Instead of querying the database repeatedly, the application first checks Redis cache.

---

# Workflow

```txt
Client Request
      │
      ▼
Check Redis Cache
      │
 ┌────┴────┐
 │ Cache Hit │ → Return Data
 └────┬────┘
      │
 Cache Miss
      ▼
Database Query
      ▼
Store Result in Redis
      ▼
Return Response
```

---

# Benefits

- Reduces database load
- Faster response time
- Improves scalability
- Reduces repeated queries

---

# Tradeoffs

| Advantage | Disadvantage |
|---|---|
| Extremely fast reads | Additional infrastructure required |
| Reduces DB traffic | Cache invalidation complexity |
| Better scalability | Increased memory usage |

---

# 2. Pagination

## Problem

Fetching all notifications at once is inefficient.

---

# Solution

Fetch notifications in smaller batches.

## Example API

```http
GET /notifications?page=1&limit=20
```

---

# Benefits

- Smaller payload size
- Faster response
- Reduced database load
- Better frontend rendering performance

---

# Tradeoffs

| Advantage | Disadvantage |
|---|---|
| Improves performance | Multiple API calls required |
| Reduces memory usage | Slight frontend complexity |

---

# 3. Lazy Loading

## Approach

Load notifications only when the user opens the notification panel instead of loading during every page refresh.

---

# Benefits

- Prevents unnecessary API calls
- Reduces backend load
- Faster page loading

---

# Tradeoffs

| Advantage | Disadvantage |
|---|---|
| Reduces unnecessary traffic | Notification data loads later |
| Better overall UX | Requires frontend event handling |

---

# 4. WebSocket-Based Real-Time Notifications

## Problem

Polling the server repeatedly wastes resources.

---

# Solution

Use WebSockets or Socket.IO for real-time updates.

The server pushes notifications only when new events occur.

---

# Workflow

```txt
Client Connects via WebSocket
           │
           ▼
Server Pushes Notification
           ▼
Frontend Updates UI Instantly
```

---

# Benefits

- Real-time updates
- Eliminates repeated polling
- Reduces unnecessary API requests
- Better user experience

---

# Tradeoffs

| Advantage | Disadvantage |
|---|---|
| Real-time communication | Persistent connections consume memory |
| Reduces repeated API calls | More complex backend architecture |

---

# 5. Read Replicas

## Approach

Separate read and write database operations.

- Primary DB handles writes
- Replica DB handles reads

---

# Benefits

- Reduced load on primary database
- Better scalability
- Improved read performance

---

# Tradeoffs

| Advantage | Disadvantage |
|---|---|
| High scalability | Replica synchronization delay |
| Better read throughput | Additional infrastructure cost |

---

# 6. Unread Notification Count Caching

## Problem

Unread counts are queried frequently.

---

# Solution

Store unread counts in Redis.

Update counts whenever:

- new notification arrives
- notification marked as read

---

# Benefits

- Extremely fast unread count retrieval
- Reduces repetitive aggregation queries

---

# Tradeoffs

| Advantage | Disadvantage |
|---|---|
| Very fast response | Cache consistency management required |

---

# 7. Background Processing Using Queues

## Approach

Use message queues like:

- RabbitMQ
- Kafka

Notifications are processed asynchronously.

---

# Workflow

```txt
Application Event
        ▼
Message Queue
        ▼
Notification Worker
        ▼
Database + WebSocket Delivery
```

---

# Benefits

- Prevents request blocking
- Better scalability
- Handles traffic spikes efficiently

---

# Tradeoffs

| Advantage | Disadvantage |
|---|---|
| Highly scalable | Increased architecture complexity |
| Better fault tolerance | Queue maintenance required |

---

# Additional Optimizations

# 1. Composite Indexing

Recommended index:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```

---

# 2. Data Archiving

Move old notifications to archive storage after 90 days.

This reduces active table size.

---

# 3. CDN for Static Assets

Frontend assets should be delivered via CDN for faster page loading.

---

# 4. API Rate Limiting

Prevent abuse and excessive requests.

---

# Recommended Final Architecture

```txt
Frontend Client
       │
       ▼
API Gateway
       │
 ┌───────────────┐
 │ Notification  │
 │ Service       │
 └───────────────┘
       │
 ┌───────────────┐
 │ Redis Cache   │
 │ WebSocket Hub │
 │ Message Queue │
 └───────────────┘
       │
 ┌───────────────┐
 │ Primary DB    │
 │ Read Replica  │
 └───────────────┘
```

---

# Best Recommended Strategy

The best practical solution is:

- Redis caching
- pagination
- lazy loading
- WebSocket real-time updates
- unread count caching

This combination provides:

- low latency
- reduced DB traffic
- scalable architecture
- improved user experience

---

# Final Conclusion

Fetching notifications from the database on every page load is not scalable for large systems.

A hybrid architecture using caching, pagination, lazy loading, WebSockets, background queues, and read replicas significantly improves:

- system scalability
- database performance
- API response time
- user experience
- real-time responsiveness

These optimizations enable the notification platform to efficiently support millions of notifications and large concurrent user traffic.
