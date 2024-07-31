document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signup-form');

    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z]+$/; // For names, city, and state
    const pincodeRegex = /^[0-9]+$/; // For pincode
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // For email
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/; // For password

    // Error messages span elements
    const emailError = document.getElementById('email_error');
    const usernameError = document.getElementById('username_error');

    // Validation functions
    function validateName(fieldId, errorId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (nameRegex.test(field.value)) {
            error.textContent = '';
            return true;
        } else {
            error.textContent = 'Please enter a valid Name.';
            return false;
        }
    }

    function validatePincode() {
        const pincode = document.getElementById('pincode');
        const error = document.getElementById('pincode_error');
        if (pincodeRegex.test(pincode.value)) {
            error.textContent = '';
            return true;
        } else {
            error.textContent = 'Please enter a valid Pincode';
            return false;
        }
    }

    function validateEmail() {
        const email = document.getElementById('email');
        const error = document.getElementById('email_error');
        if (emailRegex.test(email.value)) {
            // Check if email already exists
            fetch(`/check_email_or_username/?email=${email.value}`)
                .then(response => response.json())
                .then(data => {
                    if (data.email_exists) {
                        error.textContent = 'Email already exists.';
                    } else {
                        error.textContent = '';
                    }
                });
            return true;
        } else {
            error.textContent = 'Please enter a valid email address.';
            return false;
        }
    }

    function validateUsername() {
        const username = document.getElementById('username');
        const error = document.getElementById('username_error');
        if (username.value.trim() !== '') {
            // Check if username already exists
            fetch(`/check_email_or_username/?username=${username.value}`)
                .then(response => response.json())
                .then(data => {
                    if (data.username_exists) {
                        error.textContent = 'Username already exists.';
                    } else {
                        error.textContent = '';
                    }
                });
            return true;
        } else {
            error.textContent = 'Username cannot be empty.';
            return false;
        }
    }

    function validatePassword() {
        const password = document.getElementById('password');
        const error = document.getElementById('password_error');
        if (passwordRegex.test(password.value)) {
            error.textContent = '';
            return true;
        } else {
            error.textContent = 'Password must be 6-15 characters long, including uppercase, lowercase, numbers, and special characters.';
            return false;
        }
    }

    function validatePasswords() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm_password');
        const error = document.getElementById('confirm_password_error');
        if (password.value === confirmPassword.value) {
            error.textContent = '';
            return true;
        } else {
            error.textContent = 'Passwords does not match.';
            return false;
        }
    }

    // Toggle specialization field based on user type
    function toggleSpecializationField() {
        var userType = document.getElementById('user_type').value;
        var specializationField = document.getElementById('specialization_field');
        if (userType === 'D') {
            specializationField.style.display = 'block';
        } else {
            specializationField.style.display = 'none';
        }
    }

    // Event listeners for real-time validation
    document.getElementById('first_name').addEventListener('input', () => validateName('first_name', 'first_name_error'));
    document.getElementById('last_name').addEventListener('input', () => validateName('last_name', 'last_name_error'));
    document.getElementById('city').addEventListener('input', () => validateName('city', 'city_error'));
    document.getElementById('state').addEventListener('input', () => validateName('state', 'state_error'));
    document.getElementById('pincode').addEventListener('input', validatePincode);
    document.getElementById('email').addEventListener('input', validateEmail);
    document.getElementById('username').addEventListener('input', validateUsername);
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirm_password').addEventListener('input', validatePasswords);

    // Add event listener for real-time toggling of specialization field
    document.getElementById('user_type').addEventListener('change', toggleSpecializationField);

    // Initialize specialization field visibility
    // toggleSpecializationField();



    // Validate form on submit
    form.addEventListener('submit', function (event) {
        const isFormValid = validateName('first_name', 'first_name_error') &&
            validateName('last_name', 'last_name_error') &&
            validateName('city', 'city_error') &&
            validateName('state', 'state_error') &&
            validatePincode() &&
            validateEmail() &&
            validateUsername() &&
            validatePassword() &&
            validatePasswords();


        if (!isFormValid) {
            event.preventDefault();
        }
    });

    // // Initialize specialization field visibility
    // toggleSpecializationField();
    // document.getElementById('user_type').addEventListener('change', toggleSpecializationField);
});
