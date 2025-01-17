document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        localStorage.setItem('user', JSON.stringify({ username, password }));
        alert('Sign Up Successful!');
        window.location.href = 'home.html'; // Redirect to face recognition page
    } else {
        alert('Please fill all fields!');
    }
});
