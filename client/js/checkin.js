document.addEventListener('DOMContentLoaded', () => {
    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomType = urlParams.get('room_type');  // Room type from the query string
    const roomPrice = urlParams.get('room_price');  // Room price from the query string

    // If the room type and price are present, set them in the form
    if (roomType && roomPrice) {
        document.getElementById('room-type').value = roomType;   // Set room type field
        document.getElementById('room-price').value = `$${roomPrice} per night`;  // Set room price field
    }
});

document.getElementById('checkin-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const roomType = document.getElementById('room-type').value;
    const roomPrice = document.getElementById('room-price').value;
    const checkinDate = document.getElementById('checkin-date').value;
    const checkoutDate = document.getElementById('checkout-date').value;

    // Prepare the email subject and text content
    const subject = "Booking Confirmation";
    const text = `
        Welcome to Radisson Blu, ${name}!\n\n
        Your booking details are as follows:\n
        Room Type: ${roomType}\n
        Room Price: ${roomPrice}\n
        Check-in Date: ${checkinDate}\n
        Check-out Date: ${checkoutDate}\n\n
        We look forward to welcoming you!
    `;

    // Prepare the data to send to the server
    const bookingData = {
        to: email,            // The recipient's email
        subject: subject,     // Subject of the email
        text: text,           // Email body content
        name: name,           // Name from form
        room_type: roomType,  // Room type
        room_price: roomPrice, // Room price
        checkin_date: checkinDate,  // Check-in date
        checkout_date: checkoutDate  // Check-out date
    };

    // Send the booking details to the server via POST request
    try {
        const response = await fetch('http://localhost:8107/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            // Show the confirmation message
            document.getElementById('checkin-form').reset();
            document.getElementById('confirmation-message').classList.remove('hidden');
            setTimeout(() => {
                window.location.href = 'http://127.0.0.1:5500/client/bookings.html'; // Redirect to bookings page after 3 seconds
            }, 3000); // Wait 3 seconds before redirecting
        } else {
            alert('There was an error confirming your booking. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error confirming your booking. Please try again.');
    }
});
