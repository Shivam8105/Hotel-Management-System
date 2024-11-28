document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var roomType = urlParams.get('room_type');
    var roomPrice = urlParams.get('room_price');
    document.getElementById('room-type').value = roomType;
    document.getElementById('room-price').value = roomPrice;

    document.getElementById('checkin-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var checkinDate = document.getElementById('checkin-date').value;
        var checkoutDate = document.getElementById('checkout-date').value;
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
            window.location.href = 'bookings.html';
        })
        .catch(error => {
            console.error('Error during checkin:', error);
        });
    });
});