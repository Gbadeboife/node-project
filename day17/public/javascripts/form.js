document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const required = ['fullName', 'email', 'company', 'phone'];
        let isValid = true;
        
        required.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        if (isValid) {
            // Submit form data to /bookings API
            const formData = {
                scheduleId: form.scheduleId.value,
                fullName: form.fullName.value,
                email: form.email.value,
                company: form.company.value,
                phone: form.phone.value,
                notes: form.notes.value
            };
            fetch('/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/confirmation';
                } else {
                    alert(data.message || 'Booking failed.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Booking failed.');
            });
        }
    });
});
