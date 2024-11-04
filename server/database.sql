CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_type ENUM('superior', 'super deluxe', 'deluxe', 'single') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    wifi_available BOOLEAN NOT NULL,
    rating INT NOT NULL
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    room_id INT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
