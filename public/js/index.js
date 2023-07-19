/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBTN = document.querySelector('.nav__el--logout');
const userFormData = document.querySelector('.form-user-data');
const passwordFormData = document.querySelector('.form-user-settings');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBTN) {
  logoutBTN.addEventListener('click', logout);
}

if (userFormData) {
  userFormData.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-save-settings').innerHTML = 'Updating...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form, '<--form');

    await updateSettings(form, 'data');
    document.querySelector('.btn-save-settings').innerHTML = 'Save settings';
  });
}

if (passwordFormData) {
  passwordFormData.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-save-password').innerHTML = 'Updating...';
    const password = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;
    // data same as the API accepts
    await updateSettings(
      { password, newPassword, newPasswordConfirm },
      'password'
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn-save-password').innerHTML = 'Save password';
  });
}
