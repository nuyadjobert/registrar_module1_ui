import { Injectable } from '@angular/core';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  async getAll() {
    const response = await axios.get(`${BASE_URL}/sections`, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async create(data: any) {
    const response = await axios.post(`${BASE_URL}/sections`, data, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async update(id: number, data: any) {
    const response = await axios.put(`${BASE_URL}/sections/${id}`, data, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async delete(id: number) {
    const response = await axios.delete(`${BASE_URL}/sections/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }
}