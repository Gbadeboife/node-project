document.addEventListener('DOMContentLoaded', function() {
    // Display selected timezone
    const selectedTimezoneElement = document.getElementById('selected-timezone');
    const savedTimezone = localStorage.getItem('selectedTimezone');
    if (savedTimezone && selectedTimezoneElement) {
        selectedTimezoneElement.textContent = savedTimezone;
    }


    // Handle timezone change link
    const changeLink = document.querySelector('.change-link');
    if (changeLink) {
        changeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/';
        });
    }

    // Handle time slot selection
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            const time = this.getAttribute('data-time');
            window.location.href = `/form?time=${encodeURIComponent(time)}`;
        });
    });
});
