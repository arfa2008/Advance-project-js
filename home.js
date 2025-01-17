// Dropdown toggle functionality for the sign-in form
const loginBtn = document.getElementById('login-btn');
const signinForm = document.getElementById('signin-form');

loginBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    signinForm.style.display = signinForm.style.display === 'block' ? 'none' : 'block';
});

// Close the dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!signinForm.contains(e.target) && e.target !== loginBtn) {
        signinForm.style.display = 'none';
    }
});

// Prevent form submission for demo purposes
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    alert(`Logged in with:\nUsername: ${username}\nPassword: ${password}`);
    signinForm.style.display = 'none'; // Hide form after submit
});
