// Add event listener for form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Get stored user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Check credentials
    if (storedUser && storedUser.username === username && storedUser.password === password) {
        alert('Login Successful!');
        window.location.href = 'home.html'; // Redirect to home page
    } else {
        alert('Invalid credentials or user not registered!');
    }
});
