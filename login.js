document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
        alert('Login Successful!');
        window.location.href = 'home.html'; // Redirect to face recognition page
    } else {
        alert('Invalid credentials or user not registered!');
    }
});
