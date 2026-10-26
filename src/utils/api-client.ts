import { API_BASE_URL } from '@/constants/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.warn(`[ApiClient] Error calling ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth & Profile
  async loginWithGoogle(idToken: string) {
    return this.request<{ accessToken: string; user: any }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  async getMyProfile() {
    return this.request<any>('/profile');
  }

  async updateBusinessProfile(data: any) {
    return this.request<any>('/profile/business', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateAddress(type: 'identity' | 'business' | 'domicile', data: any) {
    return this.request<any>(`/profile/addresses/${type}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Storage Presigned Upload (Direct to RustFS)
  async getPresignedUploadUrl(category: 'documents' | 'expense' | 'products' | 'avatar', fileName: string, contentType: string) {
    return this.request<{
      uploadUrl: string;
      fileKey: string;
      publicUrl: string;
      bucket: string;
      expiresInSeconds: number;
    }>('/storage/presigned-url', {
      method: 'POST',
      body: JSON.stringify({ category, fileName, contentType }),
    });
  }

  /**
   * Upload binary file directly to RustFS using the Presigned PUT URL
   */
  async uploadFileToRustFS(uploadUrl: string, fileBlob: Blob | ArrayBuffer, contentType: string) {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: fileBlob,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file to RustFS (status ${response.status})`);
    }

    return true;
  }

  // Documents
  async getDocuments() {
    return this.request<any[]>('/documents');
  }

  async confirmDocumentUpload(documentKey: string, title: string, fileUrl: string, fileSizeBytes?: number) {
    return this.request<any>('/documents/confirm-upload', {
      method: 'POST',
      body: JSON.stringify({ documentKey, title, fileUrl, fileSizeBytes }),
    });
  }

  // Employees
  async getEmployees() {
    return this.request<any[]>('/employees');
  }

  async createEmployee(data: any) {
    return this.request<any>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: string) {
    return this.request<any>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Budget & LPJ
  async getBudgetSummary() {
    return this.request<any>('/budget/summary');
  }

  async createBudgetItem(data: any) {
    return this.request<any>('/budget/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitExpenseReceipt(data: any) {
    return this.request<any>('/budget/receipts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Attendance
  async getAttendanceSessions() {
    return this.request<any[]>('/attendance/sessions');
  }

  async verifyAttendance(sessionId: string, qrToken: string, latitude: number, longitude: number, method = 'qr_camera') {
    return this.request<any>('/attendance/verify', {
      method: 'POST',
      body: JSON.stringify({ sessionId, qrToken, latitude, longitude, method }),
    });
  }

  async getAttendanceHistory() {
    return this.request<any[]>('/attendance/history');
  }

  // BizHub
  async getBizHubAds(category?: string, latitude?: number, longitude?: number, radiusKm?: number) {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    if (latitude) query.append('latitude', latitude.toString());
    if (longitude) query.append('longitude', longitude.toString());
    if (radiusKm) query.append('radiusKm', radiusKm.toString());
    return this.request<any[]>(`/bizhub/ads?${query.toString()}`);
  }

  async getBizHubMilestones() {
    return this.request<any[]>('/bizhub/milestones');
  }

  async likeMilestone(id: string) {
    return this.request<any>(`/bizhub/milestones/${id}/like`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();
