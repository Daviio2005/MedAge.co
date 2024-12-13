document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const registerScreen = document.getElementById('register-screen');
    const medicalFormScreen = document.getElementById('medical-form-screen');
    const nosotrosScreen = document.getElementById('nosotros-screen');
    const contactoScreen = document.getElementById('contacto-screen');
    const header = document.getElementById('header');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const medicalForm = document.getElementById('medical-form');

    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const logoutButton = document.getElementById('logout-button');
    const saveMessage = document.getElementById('save-message');

    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');

    const navLinks = document.querySelectorAll('.nav-link');
    const allScreens = document.querySelectorAll('.screen');

    const loginError = document.getElementById('login-error');
    const registerSuccess = document.getElementById('register-success');

    // Función para mostrar una sección específica
    function showSection(sectionId) {
        allScreens.forEach(screen => screen.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
    }

    // Mostrar pantalla de registro
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('register-screen');
    });

    // Mostrar pantalla de login
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login-screen');
    });

    // Función para hash de la contraseña (SHA-256)
    function hashPassword(password) {
        return crypto.subtle.digest("SHA-256", new TextEncoder().encode(password))
            .then(hash => {
                let hexString = '';
                const view = new DataView(hash);
                for (let i = 0; i < hash.byteLength; i++) {
                    hexString += ('00' + view.getUint8(i).toString(16)).slice(-2);
                }
                return hexString;
            });
    }

    // Manejar el registro de usuarios
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        // Hash de la contraseña antes de guardarla
        hashPassword(password).then(hashedPassword => {
            let users = JSON.parse(localStorage.getItem('users')) || [];

            const userExists = users.some(user => user.username === username);
            if (userExists) {
                alert('El nombre de usuario ya existe.');
                return;
            }

            users.push({ username, password: hashedPassword });
            localStorage.setItem('users', JSON.stringify(users));

            registerSuccess.style.display = 'block';
            setTimeout(() => {
                registerSuccess.style.display = 'none';
                showSection('login-screen');
            }, 2000);
        });
    });

    // Manejar el inicio de sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Hash de la contraseña antes de compararla
        hashPassword(password).then(hashedPassword => {
            let users = JSON.parse(localStorage.getItem('users')) || [];

            const validUser = users.find(user => user.username === username && user.password === hashedPassword);

            if (validUser) {
                const sessionToken = btoa(username + ':' + Date.now());  // Token de sesión simulado
                localStorage.setItem('sessionToken', sessionToken);  // Guardamos el token de sesión

                showSection('medical-form-screen');
            } else {
                loginError.style.display = 'block';
                setTimeout(() => {
                    loginError.style.display = 'none';
                }, 3000);
            }
        });
    });

    // Permitir edición del formulario
    editButton.addEventListener('click', () => {
        const fields = medicalForm.querySelectorAll('input, textarea');
        fields.forEach(field => field.disabled = false);
        saveButton.style.display = 'block';
        editButton.style.display = 'none';
    });

    // Guardar datos médicos
    medicalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = localStorage.getItem('currentUser');
        const fields = medicalForm.querySelectorAll('input, textarea');

        let medicalData = {};
        fields.forEach(field => {
            field.disabled = true;
            medicalData[field.id] = field.value;
        });

        localStorage.setItem(`medicalData_${username}`, JSON.stringify(medicalData));

        saveButton.style.display = 'none';
        editButton.style.display = 'block';
        saveMessage.style.display = 'block';
        setTimeout(() => {
            saveMessage.style.display = 'none';
        }, 3000);
    });

    // Cerrar sesión
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('sessionToken');
        showSection('login-screen');
    });

    // Mostrar secciones del menú
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            if (section === 'medical-form-screen' && !localStorage.getItem('sessionToken')) {
                showSection('login-screen');
            } else {
                showSection(section);
            }
        });
    });

    // Mostrar el header siempre
    header.style.display = 'flex';

    // Mostrar pantalla de login siempre al cargar la página
    showSection('login-screen');
});

// Mostrar u ocultar contraseña en login
document.getElementById('show-login-password').addEventListener('change', function () {
    const loginPassword = document.getElementById('login-password');
    loginPassword.type = this.checked ? 'text' : 'password';
});

// Mostrar u ocultar contraseña en registro
document.getElementById('show-register-password').addEventListener('change', function () {
    const registerPassword = document.getElementById('register-password');
    registerPassword.type = this.checked ? 'text' : 'password';
});