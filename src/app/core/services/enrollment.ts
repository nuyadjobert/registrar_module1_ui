import { Injectable } from '@angular/core';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  async getAll() {
    const response = await axios.get(`${BASE_URL}/enrollments`, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async getOne(id: number) {
    const response = await axios.get(`${BASE_URL}/enrollments/${id}`, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async approve(id: number) {
    const response = await axios.post(`${BASE_URL}/enrollments/${id}/approve`, {}, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async reject(id: number) {
    const response = await axios.post(`${BASE_URL}/enrollments/${id}/reject`, {}, {
      headers: this.getHeaders()
    });
    return response.data;
  }
}