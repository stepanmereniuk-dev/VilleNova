const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://127.0.0.1:8000/api'
  : 'https://villenova.onrender.com/api';
const ROOT = window.SITE_ROOT || '.';



// 
// 
// // function getCurrentUser()=> const raw = localStorage.get return raw ? JSON.parse(raw) : null;
// }
// // 
// 
// 
// 
// 
// 
// 
// 
// 

function getCurrentUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = `${ROOT}/index.html`;
}

// 
async function registerUser(data) {
  const res = await fetch(`${API_BASE}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res;
}

//POST 
async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

function renderNavUser() {
  const slot = document.getElementById('nav-user');
  if (!slot) return;

  const user = getCurrentUser();
  if (user) {
    slot.innerHTML =
      `<button type="button" class="nav-btn" id="create-event-btn">Créer un événement</button>` +
      `<button type="button" class="nav-btn" id="logout-btn">Déconnexion</button>` +
      `<button type="button" class="nav-btn nav-user__name" id="user-btn">👤 ${user.first_name} ${user.last_name}</button>`;
    const createBtn = document.getElementById('create-event-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        window.location.href = `${ROOT}/pages/create-event.html`;
      });
    }
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  } else {
    slot.innerHTML =
      `<button type="button" class="nav-btn" id="login-btn">Connexion</button>`;
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.location.href = `${ROOT}/pages/login-registration-page.html`;
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', renderNavUser);
