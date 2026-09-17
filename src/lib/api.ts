// Production API client for Agently Homeflow - Cloudflare Workers backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
const API_PREFIX = '/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  details?: string;
  summary?: any;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.token = localStorage.getItem('agently_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('agently_token', token);
    } else {
      localStorage.removeItem('agently_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('agently_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${API_PREFIX}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error: any) {
      // For development, fallback to mock data if backend not available
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.warn(`API unavailable at ${url}, using fallback handling`);
        throw new Error('API_UNAVAILABLE');
      }
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
      localStorage.setItem('currentUserId', response.data.user.id);
      localStorage.setItem('agently_user', JSON.stringify(response.data.user));
    }
    return response;
  }

  async register(data: { email: string; password: string; firstName: string; lastName: string; phone?: string; role?: string }) {
    const response = await this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
      localStorage.setItem('currentUserId', response.data.user.id);
      localStorage.setItem('agently_user', JSON.stringify(response.data.user));
    }
    return response;
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  async getUsers(role?: string) {
    const query = role ? `?role=${role}` : '';
    return this.request<any[]>(`/auth/users${query}`);
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('agently_user');
  }

  // Properties
  async getProperties(params?: { search?: string; type?: string; status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/properties${query ? `?${query}` : ''}`);
  }

  async getProperty(id: string) {
    return this.request<any>(`/properties/${id}`);
  }

  async createProperty(data: any) {
    return this.request<any>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: string, data: any) {
    return this.request<any>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string) {
    return this.request<any>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async getPropertyUnits(propertyId: string) {
    return this.request<any[]>(`/properties/${propertyId}/units`);
  }

  async createUnit(propertyId: string, data: any) {
    return this.request<any>(`/properties/${propertyId}/units`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tenants
  async getTenants(params?: { search?: string; status?: string; paymentStatus?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/tenants${query ? `?${query}` : ''}`);
  }

  async getTenant(id: string) {
    return this.request<any>(`/tenants/${id}`);
  }

  async createTenant(data: any) {
    return this.request<any>('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTenant(id: string, data: any) {
    return this.request<any>(`/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTenant(id: string) {
    return this.request<any>(`/tenants/${id}`, {
      method: 'DELETE',
    });
  }

  // Payments
  async getPayments(params?: { search?: string; status?: string; method?: string; propertyId?: string; tenantId?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/payments${query ? `?${query}` : ''}`);
  }

  async getPayment(id: string) {
    return this.request<any>(`/payments/${id}`);
  }

  async createPayment(data: any) {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async recordPayment(data: { tenantId: string; amount: number; method?: string; date?: string }) {
    return this.request<any>('/payments/record', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePayment(id: string, data: any) {
    return this.request<any>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Maintenance
  async getMaintenance(params?: { status?: string; priority?: string; propertyId?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/maintenance${query ? `?${query}` : ''}`);
  }

  async getMaintenanceRequest(id: string) {
    return this.request<any>(`/maintenance/${id}`);
  }

  async createMaintenance(data: any) {
    return this.request<any>('/maintenance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMaintenance(id: string, data: any) {
    return this.request<any>(`/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async assignMaintenance(id: string, contractorId: string) {
    return this.request<any>(`/maintenance/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ contractorId }),
    });
  }

  // Expenses
  async getExpenses(params?: { category?: string; propertyId?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/expenses${query ? `?${query}` : ''}`);
  }

  async createExpense(data: any) {
    return this.request<any>('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateExpense(id: string, data: any) {
    return this.request<any>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteExpense(id: string) {
    return this.request<any>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getAnalyticsSummary() {
    return this.request<any>('/analytics/summary');
  }

  async getRevenueAnalytics() {
    return this.request<any>('/analytics/revenue');
  }

  async getOccupancyAnalytics() {
    return this.request<any>('/analytics/occupancy');
  }

  // Listings
  async getListings(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/listings${query ? `?${query}` : ''}`);
  }

  async createListing(data: any) {
    return this.request<any>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateListing(id: string, data: any) {
    return this.request<any>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Leads
  async getLeads(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/leads${query ? `?${query}` : ''}`);
  }

  async createLead(data: any) {
    return this.request<any>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLead(id: string, data: any) {
    return this.request<any>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Applications
  async getApplications(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/applications${query ? `?${query}` : ''}`);
  }

  async createApplication(data: any) {
    return this.request<any>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApplication(id: string, data: any) {
    return this.request<any>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Uploads
  async uploadFile(file: File, category: string = 'other', metadata?: { propertyId?: string; unitId?: string }) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (metadata?.propertyId) formData.append('propertyId', metadata.propertyId);
    if (metadata?.unitId) formData.append('unitId', metadata.unitId);

    const url = `${this.baseUrl}${API_PREFIX}/uploads`;
    const token = this.getToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    return data;
  }

  // Health
  async healthCheck() {
    return this.request<any>('/health');
  }

  // Seed (dev)
  async seedDatabase() {
    return this.request<any>('/seed', {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Helper to check if API is available
export async function isApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/health`, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}

// Export types
export type { ApiResponse };
