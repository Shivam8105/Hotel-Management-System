document.addEventListener('DOMContentLoaded', function() {
    // Get the room type and price from the URL parameters
    var urlParams = new URLSearchParams(window.location.search);
    var roomType = urlParams.get('room_type');
    var roomPrice = urlParams.get('room_price');

    // Display the room type and price in the form
    document.getElementById('room-type').value = roomType;
    document.getElementById('room-price').value = roomPrice;

    document.getElementById('checkin-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get the form values
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var checkinDate = document.getElementById('checkin-date').value;
        var checkoutDate = document.getElementById('checkout-date').value;

        // Send the form data to the server
        fetch('php/process_checkin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                name: name,
                email: email,
                'room-type': roomType,
                'room-price': roomPrice,
                'checkin-date': checkinDate,
                'checkout-date': checkoutDate
            })
        })
        .then(response => {
            // Redirect to the Bookings page after successful checkin
            window.location.href = 'bookings.html';
        })
        .catch(error => {
            console.error('Error during checkin:', error);
        });
    });
});