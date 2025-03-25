import sqlite3
import datetime
import random
from faker import Faker

# Initialize Faker
fake = Faker()

# Connect to SQLite database (creates it if it doesn't exist)
conn = sqlite3.connect('airbnb_workshop.db')
cursor = conn.cursor()

# Create tables
def create_tables():
    # Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(100) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        is_host BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Properties table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS properties (
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
    ''')

    # Bookings table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bookings (
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
    ''')

    # Reviews table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS reviews (
        review_id INTEGER PRIMARY KEY,
        booking_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
    )
    ''')

# Generate sample data
def generate_sample_data():
    # Generate users (both hosts and guests)
    users_data = []
    for i in range(50):  # Create 50 users
        is_host = random.choice([True, False])
        users_data.append((
            fake.user_name(),
            fake.email(),
            fake.sha256(),  # Simulated password hash
            fake.first_name(),
            fake.last_name(),
            is_host
        ))
    
    cursor.executemany('''
    INSERT INTO users (username, email, password_hash, first_name, last_name, is_host)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', users_data)

    # Get all host IDs
    cursor.execute('SELECT user_id FROM users WHERE is_host = 1')
    host_ids = [row[0] for row in cursor.fetchall()]

    # Generate properties
    property_types = ['House', 'Apartment', 'Villa', 'Cottage', 'Condo']
    room_types = ['Entire place', 'Private room', 'Shared room']
    
    properties_data = []
    for _ in range(100):  # Create 100 properties
        properties_data.append((
            random.choice(host_ids),
            fake.catch_phrase(),  # Title
            fake.text(),  # Description
            random.choice(property_types),
            random.choice(room_types),
            random.randint(1, 10),  # max_guests
            random.randint(1, 5),   # bedrooms
            random.randint(1, 4),   # bathrooms
            round(random.uniform(50, 500), 2),  # price_per_night
            fake.street_address(),
            fake.city(),
            fake.state(),
            fake.country(),
            float(fake.latitude()),
            float(fake.longitude())
        ))

    cursor.executemany('''
    INSERT INTO properties (
        host_id, title, description, property_type, room_type,
        max_guests, bedrooms, bathrooms, price_per_night,
        address, city, state, country, latitude, longitude
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', properties_data)

    # Generate bookings
    cursor.execute('SELECT user_id FROM users WHERE is_host = 0')
    guest_ids = [row[0] for row in cursor.fetchall()]

    cursor.execute('SELECT property_id, price_per_night FROM properties')
    properties = cursor.fetchall()

    bookings_data = []
    for _ in range(200):  # Create 200 bookings
        property_id, price = random.choice(properties)
        check_in = fake.date_between(start_date='-1y', end_date='+1y')
        duration = random.randint(1, 14)
        check_out = check_in + datetime.timedelta(days=duration)
        total_price = float(price) * duration

        bookings_data.append((
            property_id,
            random.choice(guest_ids),
            check_in.strftime('%Y-%m-%d'),
            check_out.strftime('%Y-%m-%d'),
            round(total_price, 2),
            random.choice(['completed', 'upcoming', 'cancelled'])
        ))

    cursor.executemany('''
    INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date, total_price, status)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', bookings_data)

    # Generate reviews for completed bookings
    cursor.execute('SELECT booking_id FROM bookings WHERE status = "completed"')
    completed_bookings = cursor.fetchall()

    reviews_data = []
    for (booking_id,) in completed_bookings:
        if random.random() < 0.8:  # 80% chance of leaving a review
            reviews_data.append((
                booking_id,
                random.randint(3, 5),  # Rating between 3-5 (slightly biased towards positive)
                fake.text()
            ))

    cursor.executemany('''
    INSERT INTO reviews (booking_id, rating, comment)
    VALUES (?, ?, ?)
    ''', reviews_data)

def main():
    create_tables()
    generate_sample_data()
    conn.commit()
    print("Database created and populated successfully!")

if __name__ == "__main__":
    main()
    conn.close() 