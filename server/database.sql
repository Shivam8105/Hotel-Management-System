CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('guest', 'admin', 'staff') DEFAULT 'guest'
);

CREATE TABLE RoomTypes (
    room_type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    max_occupancy INT NOT NULL
);

CREATE TABLE Rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type_id INT NOT NULL,
    status ENUM('available', 'occupied', 'cleaning', 'maintenance') DEFAULT 'available',
    FOREIGN KEY (room_type_id) REFERENCES RoomTypes(room_type_id)
);

CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'checked_in', 'completed', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (room_id) REFERENCES Rooms(room_id)
);

-- Check-In Details Table
CREATE TABLE CheckInDetails (
    check_in_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT UNIQUE NOT NULL,
    actual_check_in_time DATETIME,
    guest_name VARCHAR(100),
    guest_email VARCHAR(100),
    guest_phone VARCHAR(20),
    identification_type ENUM('passport', 'driver_license', 'national_id'),
    identification_number VARCHAR(50),
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id)
);

CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('credit_card', 'debit_card', 'cash', 'online_transfer'),
    status ENUM('pending', 'completed', 'failed'),
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id)
);
CREATE INDEX idx_user_bookings ON Bookings(user_id);
CREATE INDEX idx_room_bookings ON Bookings(room_id);
CREATE INDEX idx_booking_status ON Bookings(status);
CREATE INDEX idx_room_status ON Rooms(status);

INSERT INTO RoomTypes (type_name, description, base_price, max_occupancy) VALUES
('single', 'Basic room for solo travelers', 75.00, 1),
('superior', 'Comfortable room with additional amenities', 100.00, 2),
('deluxe', 'Spacious room with enhanced features', 150.00, 3),
('super deluxe', 'Luxury room with premium services', 250.00, 4);

INSERT INTO Rooms (room_number, room_type_id, status) VALUES
('201', 2, 'available'),
('202', 2, 'occupied'),
('203', 4, 'cleaning'),
('204', 1, 'maintenance');