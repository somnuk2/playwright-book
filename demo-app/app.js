const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const users = {
  standard_user: 'secret_sauce',
  problem_user: 'secret_sauce',
  performance_glitch_user: 'secret_sauce'
};

function requireUser() {
  const user = localStorage.getItem('demo_user');
  if (!user) location.href = '/';
  return user;
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(ids) {
  localStorage.setItem('cart', JSON.stringify(ids));
  updateBadge();
}
function updateBadge() {
  const badge = $('[data-test="cart-badge"]');
  if (badge) badge.textContent = String(getCart().length);
}
async function loadProducts() {
  const response = await fetch('/api/products');
  if (!response.ok) return [];
  const data = await response.json();
  return data.products || [];
}
function logout() {
  localStorage.removeItem('demo_user');
  localStorage.removeItem('cart');
  location.href = '/';
}

window.demo = { requireUser, getCart, setCart, updateBadge, loadProducts, logout };

window.addEventListener('DOMContentLoaded', () => {
  const loginForm = $('[data-test="login-form"]');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = $('[data-test="username"]').value.trim();
      const password = $('[data-test="password"]').value;
      const error = $('[data-test="error"]');
      if (username === 'locked_out_user') {
        error.textContent = 'Sorry, this user has been locked out.';
        return;
      }
      if (users[username] !== password) {
        error.textContent = 'Username and password do not match any user in this service.';
        return;
      }
      localStorage.setItem('demo_user', username);
      localStorage.setItem('cart', '[]');
      location.href = '/inventory.html';
    });
  }

  const logoutButton = $('[data-test="logout"]');
  if (logoutButton) logoutButton.addEventListener('click', logout);
});
