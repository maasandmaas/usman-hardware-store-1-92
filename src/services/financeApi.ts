
const BASE_URL = 'https://zaidawn.site/wp-json/ims/v1';

// Finance API response types
export interface FinanceOverview {
  revenue: {
    total: number;
    cash: number;
    credit: number;
    growth: number;
  };
  expenses: {
    total: number;
    purchases: number;
    operational: number;
    growth: number;
  };
  profit: {
    gross: number;
    net: number;
    margin: number;
  };
  accountsReceivable: number;
  accountsPayable: number;
  cashFlow: {
    inflow: number;
    outflow: number;
    net: number;
  };
}

export interface AccountsReceivable {
  id: number;
  customerId: number;
  customerName: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  daysOverdue: number;
  status: string;
}

export interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  reference: string;
  paymentMethod: string;
  receipt?: string;
  createdBy: string;
}

export interface PaymentRequest {
  customerId: number;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque';
  reference: string;
  notes?: string;
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
    console.error('Finance API request failed:', error);
    throw error;
  }
};

export const financeApi = {
  getOverview: (period: 'today' | 'week' | 'month' | 'year' = 'month') => {
    return apiRequest<{ success: boolean; data: FinanceOverview }>(`/finance/overview?period=${period}`);
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
    return apiRequest<{
      success: boolean;
      data: {
        receivables: AccountsReceivable[];
        summary: {
          totalReceivables: number;
          overdueAmount: number;
          overdueCount: number;
        };
      };
    }>(`/finance/accounts-receivable${query ? `?${query}` : ''}`);
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
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiRequest<{
      success: boolean;
      data: {
        expenses: Expense[];
        summary: {
          totalExpenses: number;
          categories: Array<{ category: string; amount: number }>;
        };
      };
    }>(`/finance/expenses${query ? `?${query}` : ''}`);
  },

  recordPayment: (payment: PaymentRequest) => {
    return apiRequest<{
      success: boolean;
      data: {
        payment: any;
        updatedBalance: number;
      };
      message: string;
    }>('/finance/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  },
};
