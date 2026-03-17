import { Injectable } from '@angular/core';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async login(email: string, password: string) {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });
    const token = response.data.token;
    localStorage.setItem('token', token);
    return response.data;
  }

  async logout() {
    const token = localStorage.getItem('token');
    await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}