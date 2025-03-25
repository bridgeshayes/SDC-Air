# Airbnb Workshop Database Schema

This document provides a detailed description of the database schema used in the Airbnb workshop project.

## Tables Overview

### 1. Users Table
```sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_host BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Description:**
- Stores information about all users in the system (both hosts and guests)
- Each user has a unique username and email
- `is_host` flag indicates whether the user can list properties
- `created_at` tracks when the user account was created

**Key Fields:**
- `user_id`: Unique identifier for each user
- `username`: Unique username for login
- `email`: User's email address
- `is_host`: Boolean flag (TRUE for hosts, FALSE for guests)

### 2. Properties Table
```sql
CREATE TABLE properties (
    property_id INTEGER PRIMARY KEY,
    host_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    max_guests INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    address VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES users(user_id)
)
```

**Description:**
- Contains all property listings in the system
- Links to the host through `host_id`
- Includes detailed property information and location data

**Key Fields:**
- `property_id`: Unique identifier for each property
- `host_id`: References the user who owns the property
- `property_type`: Type of property (House, Apartment, Villa, etc.)
- `room_type`: Type of room (Entire place, Private room, Shared room)
- `price_per_night`: Cost for one night's stay
- `latitude`/`longitude`: Geographic coordinates for mapping

### 3. Bookings Table
```sql
CREATE TABLE bookings (
    booking_id INTEGER PRIMARY KEY,
    property_id INTEGER NOT NULL,
    guest_id INTEGER NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(property_id),
    FOREIGN KEY (guest_id) REFERENCES users(user_id)
)
```

**Description:**
- Records all bookings made in the system
- Links to both the property and the guest
- Tracks booking status and dates

**Key Fields:**
- `booking_id`: Unique identifier for each booking
- `property_id`: References the booked property
- `guest_id`: References the user making the booking
- `check_in_date`/`check_out_date`: Booking period
- `status`: Current status (completed/upcoming/cancelled)
- `total_price`: Total cost for the entire stay

### 4. Reviews Table
```sql
CREATE TABLE reviews (
    review_id INTEGER PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
)
```

**Description:**
- Stores reviews and ratings for completed bookings
- Only allows reviews for completed bookings
- Rating system from 1 to 5 stars

**Key Fields:**
- `review_id`: Unique identifier for each review
- `booking_id`: References the booking being reviewed
- `rating`: Numeric rating (1-5)
- `comment`: Text review

## Relationships

1. **Users → Properties**
   - One-to-Many relationship
   - A user (host) can have multiple properties
   - Each property belongs to exactly one host

2. **Properties → Bookings**
   - One-to-Many relationship
   - A property can have multiple bookings
   - Each booking is for exactly one property

3. **Users → Bookings**
   - One-to-Many relationship
   - A user (guest) can have multiple bookings
   - Each booking is made by exactly one guest

4. **Bookings → Reviews**
   - One-to-One relationship
   - A booking can have at most one review
   - A review belongs to exactly one booking

## Common Queries

Here are some example queries that might be useful:

1. **Find all properties by a specific host:**
```sql
SELECT * FROM properties WHERE host_id = ?;
```

2. **Get all bookings for a property:**
```sql
SELECT b.*, u.username as guest_name 
FROM bookings b 
JOIN users u ON b.guest_id = u.user_id 
WHERE b.property_id = ?;
```

3. **Get average rating for a property:**
```sql
SELECT AVG(r.rating) as avg_rating 
FROM reviews r 
JOIN bookings b ON r.booking_id = b.booking_id 
WHERE b.property_id = ?;
```

4. **Find available properties in a city:**
```sql
SELECT p.* 
FROM properties p 
WHERE p.city = ? 
AND p.property_id NOT IN (
    SELECT property_id 
    FROM bookings 
    WHERE status = 'upcoming'
);
``` 