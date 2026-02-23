import axios from 'axios';
import { BASE_URL, TOKEN_KEY } from '../config';

const apiClient = axios.create({ baseURL: BASE_URL, timeout: 60000 });

// Auto-attach JWT to every request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Image Helpers ─────────────────────────────────────────────────────────────

function dataURLtoFile(dataUrl, filename = 'face_capture.jpg') {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
}

// ── AI Analysis ───────────────────────────────────────────────────────────────

/**
 * Upload an image (File or base64 dataURL) to POST /analyze
 * Returns: { analysis: {...}, explanation: {...} }
 */
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

// ── Assessments (History) ─────────────────────────────────────────────────────

/**
 * Save a scan result to MongoDB history.
 * Returns: { id: string, message: string }
 */
export async function saveAssessment(data) {
    const response = await apiClient.post('/assessments', data);
    return response.data;
}

/**
 * Get all saved assessments for the logged-in user.
 * Returns: Array of assessment objects
 */
export async function getAssessments() {
    const response = await apiClient.get('/assessments');
    return response.data;
}

/**
 * Delete a single assessment by ID.
 */
export async function deleteAssessment(id) {
    const response = await apiClient.delete(`/assessments/${id}`);
    return response.data;
}

/**
 * Submit user feedback on an assessment result (for model retraining).
 * body: { user_agrees, corrected_severity?, comment? }
 */
export async function saveFeedback(id, body) {
    const response = await apiClient.post(`/assessments/${id}/feedback`, body);
    return response.data;
}

// ── Health Check ──────────────────────────────────────────────────────────────

export async function checkHealth() {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
}

export default apiClient;
