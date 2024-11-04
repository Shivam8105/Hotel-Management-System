// Registration Logic
document.getElementById('registrationForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Simple validation
    if (!name || !email || !password || password !== confirmPassword) {
        alert('Please fill all fields correctly!');
        return;
    }

    // Check if the user already exists
    const existingUser = localStorage.getItem(email);
    if (existingUser) {
        alert('User already exists!');
        return;
    }

    // Save user data in Local Storage
    const userData = {
        name: name,
        email: email,
        password: password // Note: In a real application, hash passwords!
    };

    localStorage.setItem(email, JSON.stringify(userData));
    alert('Registration successful! You can now log in.');
    window.location.href = 'login.html'; // Redirect to login
});

// Login Logic
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Retrieve user data from Local Storage
    const userData = localStorage.getItem(email);
    if (!userData) {
        alert('User does not exist!');
        return;
    }

    const user = JSON.parse(userData);

    // Check password
    if (user.password === password) {
        alert('Login successful!');
        // Redirect to booking page after successful login
        window.location.href = 'rooms.html';
    } else {
        alert('Incorrect password!');
    }
});

// Room Booking Logic
function bookRoom(roomType, price) {
    // Redirect to check-in page and store room info in Local Storage
    localStorage.setItem('currentRoom', JSON.stringify({ roomType, price }));
    window.location.href = 'checkin.html';
}

// Check-In Logic
document.getElementById('checkinForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const guestName = document.getElementById('guestName').value;
    const guestEmail = document.getElementById('guestEmail').value;
    const guestPhone = document.getElementById('guestPhone').value;
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;

    // Simple validation
    if (!guestName || !guestEmail || !guestPhone || !checkInDate || !checkOutDate) {
        alert('Please fill all fields!');
        return;
    }

    const currentRoom = JSON.parse(localStorage.getItem('currentRoom'));

    // Create booking summary
    const bookingSummary = {
        roomType: currentRoom.roomType,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        totalPrice: currentRoom.price // Assume price is fixed for this example
    };

    // Store booking in Local Storage
    const bookingList = JSON.parse(localStorage.getItem('bookingList')) || [];
    bookingList.push(bookingSummary);
    localStorage.setItem('bookingList', JSON.stringify(bookingList));

    alert('Check-In successful! Your booking has been confirmed.');
    window.location.href = 'bookings.html'; // Redirect to bookings page
});

// Display Bookings
function displayBookings() {
    const bookingList = JSON.parse(localStorage.getItem('bookingList')) || [];
    const bookingListElement = document.getElementById('bookingList');
    const bookingSummaryBody = document.getElementById('bookingSummaryBody');

    // Display current bookings
    bookingList.forEach(booking => {
        const li = document.createElement('li');
        li.textContent = `${booking.roomType} | Check-In: ${booking.checkInDate} | Check-Out: ${booking.checkOutDate} | Total Price: $${booking.totalPrice}`;
        bookingListElement.appendChild(li);

        // Display in booking summary table if on check-in page
        if (bookingSummaryBody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${booking.roomType}</td><td>${booking.checkInDate}</td><td>${booking.checkOutDate}</td><td>$${booking.totalPrice}</td>`;
            bookingSummaryBody.appendChild(tr);
        }
    });
}

// Call the function to display bookings on appropriate pages
if (document.getElementById('bookingList')) {
    displayBookings();
}
if (document.getElementById('bookingSummaryBody')) {
    displayBookings();
}
