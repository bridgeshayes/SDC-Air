# Airbnb Workshop Database

This is a sample SQLite database that mimics core Airbnb functionality, designed for educational purposes. The database includes tables for users, properties, bookings, and reviews, populated with realistic sample data.

## Database Schema

The database consists of the following tables:

1. `users` - Store user information (both hosts and guests)
2. `properties` - Store property listings
3. `bookings` - Store booking information
4. `reviews` - Store property reviews

## Setup Instructions

1. Make sure you have Python 3.x installed on your system
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Generate the database by running:
   ```bash
   python create_airbnb_db.py
   ```

This will create a file called `airbnb_workshop.db` in your current directory.

## Sample Data

The database comes pre-populated with:
- 50 users (mix of hosts and guests)
- 100 properties
- 200 bookings
- Reviews for approximately 80% of completed bookings

## Database Details

### Users Table
- Includes both hosts and guests
- Contains basic user information like username, email, and name
- `is_host` flag to distinguish between hosts and guests

### Properties Table
- Contains detailed property information
- Includes location data (address, coordinates)
- Links to host through `host_id`
- Includes pricing and capacity information

### Bookings Table
- Records all bookings
- Includes check-in/check-out dates
- Contains booking status (completed/upcoming/cancelled)
- Links to both property and guest

### Reviews Table
- Contains ratings (1-5 stars) and text reviews
- Links to bookings
- Only exists for completed bookings

## Using the Database

You can connect to the database using any SQLite client or through Python using the `sqlite3` module:

```python
import sqlite3

conn = sqlite3.connect('airbnb_workshop.db')
cursor = conn.cursor()

# Example query
cursor.execute('SELECT * FROM properties LIMIT 5')
results = cursor.fetchall()
``` 