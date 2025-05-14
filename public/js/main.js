/**
 * Main JavaScript file for client-side functionality
 */

document.addEventListener('DOMContentLoaded', function () {
  // Handle flash message dismissal
  const flashMessages = document.querySelectorAll('.flash-message');
  flashMessages.forEach(message => {
    // Auto-dismiss flash messages after 5 seconds
    setTimeout(() => {
      message.style.display = 'none';
    }, 5000);

    // Allow manual dismissal with close button
    const closeBtn = message.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        message.style.display = 'none';
      });
    }
  });

  // Add visual validation feedback on all form inputs
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      input.addEventListener('input', function () {
        if (this.validity.valid) {
          this.classList.remove('invalid');
          this.classList.add('valid');
        } else {
          this.classList.remove('valid');
          this.classList.add('invalid');
        }
      });
    });
  });

  //  Additional validation for trip planner form
  const tripForm = document.getElementById('tripForm');
  if (tripForm) {
    tripForm.addEventListener('submit', function (e) {
      const destination = tripForm.querySelector('#destination');
      const preferences = tripForm.querySelector('#preferences');

      // Trim fields to remove leading/trailing spaces
      destination.value = destination.value.trim();
      preferences.value = preferences.value.trim();

      // Native HTML5 form validation
      if (!tripForm.checkValidity()) {
        e.preventDefault();
        alert('️ Please complete all fields correctly before submitting.');
        return;
      }

      // Additional pattern check for destination: letters and spaces only
      const destinationPattern = /^[a-zA-Z\s]{1,50}$/;
      if (!destinationPattern.test(destination.value)) {
        e.preventDefault();
        alert(' Destination must contain only letters and spaces.');
        destination.focus();
        return;
      }

      // Minimum length for preferences
      if (preferences.value.length < 10) {
        e.preventDefault();
        alert(' Please enter at least 10 characters in the preferences field.');
        preferences.focus();
      }
    });
  }
});
