
const BASE_URL = 'https://zaidawn.site/wp-json/ims/v1';

// API response types for reports
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SalesReportData {
  salesReport: Array<{
    period: string;
    totalSales: number;
    totalOrders: number;
    avgOrderValue: number;
    topProduct: string;
  }>;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    growth: number;
  };
}

export interface InventoryReportData {
  inventoryReport: {
    totalProducts: number;
    totalValue: number;
    lowStockItems: Array<{
      productId: number;
      productName: string;
      currentStock: number;
      minStock: number;
      reorderQuantity: number;
    }>;
    fastMovingItems: Array<{
      productId: number;
      productName: string;
      soldQuantity: number;
      revenue: number;
    }>;
    slowMovingItems: any[];
    deadStock: any[];
  };
}

export interface FinancialReportData {
  financialReport: {
    revenue: {
      total: number;
      breakdown: Array<{
        month: string;
        amount: number;
      }>;
    };
    expenses: {
      total: number;
      breakdown: Array<{
        category: string;
        amount: number;
      }>;
    };
    profit: {
      gross: number;
      net: number;
      margin: number;
    };
    cashFlow: {
      opening: number;
      inflow: number;
      outflow: number;
      closing: number;
    };
  };
}

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Reports API request failed:', error);
    throw error;
  }
};

// Reports API
export const reportsApi = {
  getSalesReport: (params?: {
    period?: "daily" | "weekly" | "monthly" | "yearly";
    dateFrom?: string;
    dateTo?: string;
    groupBy?: "date" | "product" | "customer" | "category";
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<ApiResponse<SalesReportData>>(`/reports/sales${query ? `?${query}` : ''}`);
  },

  getInventoryReport: () => 
    apiRequest<ApiResponse<InventoryReportData>>('/reports/inventory'),

  getFinancialReport: (params?: {
    period?: "monthly" | "quarterly" | "yearly";
    year?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<ApiResponse<FinancialReportData>>(`/reports/financial${query ? `?${query}` : ''}`);
  },
};
