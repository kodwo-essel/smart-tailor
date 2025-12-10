import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';

class UploadService {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${apiService['baseURL']}/api/upload-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Full upload response:', result);
    console.log('Data field:', result.data);
    console.log('Message field:', result.message);
    return result.data;
  }
}

export default new UploadService();