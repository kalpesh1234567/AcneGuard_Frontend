import axios from 'axios';
import { BASE_URL, TOKEN_KEY } from '../config';

const apiClient = axios.create({ baseURL: BASE_URL, timeout: 30000 });

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

function dataURLtoFile(dataUrl, filename = 'face_capture.jpg') {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
}

export async function analyzeImage(imageInput) {
    const file = typeof imageInput === 'string'
        ? dataURLtoFile(imageInput, 'face_capture.jpg')
        : imageInput;

    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
}

export async function checkHealth() {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
}

export default apiClient;
