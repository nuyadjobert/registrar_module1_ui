import { Injectable } from '@angular/core';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  async getAll() {
    const response = await axios.get(`${BASE_URL}/students`, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async getOne(id: number) {
    const response = await axios.get(`${BASE_URL}/students/${id}`, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async getCOR(id: number) {
    const response = await axios.get(`${BASE_URL}/students/${id}/cor`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getTranscript(id: number) {
    const response = await axios.get(`${BASE_URL}/students/${id}/transcript`, {
      headers: this.getHeaders()
    });
    return response.data;
  }
}