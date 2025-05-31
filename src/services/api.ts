
const BASE_URL = 'https://zaidawn.site/wp-json/ims/v1';

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

// Get JWT token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

// Create headers with authentication
const createHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = createHeaders();

  try {
    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Dashboard API
export const dashboardApi = {
  getStats: () => apiRequest<ApiResponse<any>>('/dashboard/stats'),
};

// Products API
export const productsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/products${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) => apiRequest<ApiResponse<any>>(`/products/${id}`),
  
  create: (product: any) => 
    apiRequest<ApiResponse<any>>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),
  
  update: (id: number, product: any) =>
    apiRequest<ApiResponse<any>>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),
  
  delete: (id: number) =>
    apiRequest<ApiResponse<any>>(`/products/${id}`, {
      method: 'DELETE',
    }),
  
  adjustStock: (id: number, adjustment: any) =>
    apiRequest<ApiResponse<any>>(`/products/${id}/stock-adjustment`, {
      method: 'POST',
      body: JSON.stringify(adjustment),
    }),
};

// Customers API
export const customersApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/customers${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) => apiRequest<ApiResponse<any>>(`/customers/${id}`),
  
  create: (customer: any) =>
    apiRequest<ApiResponse<any>>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    }),
  
  update: (id: number, customer: any) =>
    apiRequest<ApiResponse<any>>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    }),
};

// Sales API
export const salesApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    customerId?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/sales${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) => apiRequest<ApiResponse<any>>(`/sales/${id}`),
  
  create: (sale: any) =>
    apiRequest<ApiResponse<any>>('/sales', {
      method: 'POST',
      body: JSON.stringify(sale),
    }),
  
  updateStatus: (id: number, status: any) =>
    apiRequest<ApiResponse<any>>(`/sales/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    }),
};

// Inventory API
export const inventoryApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    lowStock?: boolean;
    outOfStock?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/inventory${query ? `?${query}` : ''}`);
  },
  
  getMovements: (params?: {
    page?: number;
    limit?: number;
    productId?: number;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/inventory/movements${query ? `?${query}` : ''}`);
  },
  
  restock: (restock: any) =>
    apiRequest<ApiResponse<any>>('/inventory/restock', {
      method: 'POST',
      body: JSON.stringify(restock),
    }),
};

// Suppliers API
export const suppliersApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/suppliers${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) => apiRequest<ApiResponse<any>>(`/suppliers/${id}`),
  
  create: (supplier: any) =>
    apiRequest<ApiResponse<any>>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
    }),
};

// Purchase Orders API
export const purchaseOrdersApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    supplierId?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/purchase-orders${query ? `?${query}` : ''}`);
  },
  
  create: (purchaseOrder: any) =>
    apiRequest<ApiResponse<any>>('/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(purchaseOrder),
    }),
  
  receive: (id: number, receiveData: any) =>
    apiRequest<ApiResponse<any>>(`/purchase-orders/${id}/receive`, {
      method: 'PUT',
      body: JSON.stringify(receiveData),
    }),
};

// Quotations API
export const quotationsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    customerId?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/quotations${query ? `?${query}` : ''}`);
  },
  
  create: (quotation: any) =>
    apiRequest<ApiResponse<any>>('/quotations', {
      method: 'POST',
      body: JSON.stringify(quotation),
    }),
  
  convertToSale: (id: number) =>
    apiRequest<ApiResponse<any>>(`/quotations/${id}/convert-to-sale`, {
      method: 'PUT',
    }),
};

// Finance API
export const financeApi = {
  getOverview: (period?: string) => {
    const query = period ? `?period=${period}` : '';
    return apiRequest<ApiResponse<any>>(`/finance/overview${query}`);
  },
  
  getAccountsReceivable: (params?: {
    page?: number;
    limit?: number;
    overdue?: boolean;
    customerId?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/finance/accounts-receivable${query ? `?${query}` : ''}`);
  },
  
  getExpenses: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/finance/expenses${query ? `?${query}` : ''}`);
  },
  
  recordPayment: (payment: any) =>
    apiRequest<ApiResponse<any>>('/finance/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    }),
};

// Reports API
export const reportsApi = {
  getSalesReport: (params?: {
    period?: string;
    dateFrom?: string;
    dateTo?: string;
    groupBy?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<ApiResponse<any>>(`/reports/sales${query ? `?${query}` : ''}`);
  },
  
  getInventoryReport: () => apiRequest<ApiResponse<any>>('/reports/inventory'),
  
  getFinancialReport: (params?: {
    period?: string;
    year?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<ApiResponse<any>>(`/reports/financial${query ? `?${query}` : ''}`);
  },
};

// Notifications API
export const notificationsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    read?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(`/notifications${query ? `?${query}` : ''}`);
  },
  
  markAsRead: (id: number) =>
    apiRequest<ApiResponse<any>>(`/notifications/${id}/read`, {
      method: 'PUT',
    }),
  
  markAllAsRead: () =>
    apiRequest<ApiResponse<any>>('/notifications/mark-all-read', {
      method: 'PUT',
    }),
};

// Calendar API
export const calendarApi = {
  getEvents: (params?: {
    date?: string;
    month?: string;
    type?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<ApiResponse<any>>(`/calendar/events${query ? `?${query}` : ''}`);
  },
  
  createEvent: (event: any) =>
    apiRequest<ApiResponse<any>>('/calendar/events', {
      method: 'POST',
      body: JSON.stringify(event),
    }),
};

// Backup API
export const backupApi = {
  getStatus: () => apiRequest<ApiResponse<any>>('/backup/status'),
  
  createBackup: () =>
    apiRequest<ApiResponse<any>>('/backup/create', {
      method: 'POST',
    }),
  
  getHistory: () => apiRequest<ApiResponse<any>>('/backup/history'),
};

// Settings API
export const settingsApi = {
  get: () => apiRequest<ApiResponse<any>>('/settings'),
  
  update: (settings: any) =>
    apiRequest<ApiResponse<any>>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};

// Authentication API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<ApiResponse<any>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  logout: () =>
    apiRequest<ApiResponse<any>>('/auth/logout', {
      method: 'POST',
    }),
  
  refresh: () =>
    apiRequest<ApiResponse<any>>('/auth/refresh', {
      method: 'POST',
    }),
};
