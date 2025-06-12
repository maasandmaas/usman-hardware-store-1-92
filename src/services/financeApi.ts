
const BASE_URL = 'https://zaidawn.site/wp-json/ims/v1';

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Customer balance update types
export interface CustomerBalanceUpdate {
  customerId: number;
  orderId: number;
  amount: number;
  type: 'credit' | 'debit';
  orderNumber: string;
  description: string;
}

export interface CustomerBalance {
  customerId: number;
  currentBalance: number;
  totalPurchases: number;
  creditLimit: number;
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

// Finance API endpoints
export const financeApi = {
  // Update customer balance for order payment method changes
  updateCustomerBalance: (update: CustomerBalanceUpdate) =>
    apiRequest<ApiResponse<CustomerBalance>>('/customers/update-balance', {
      method: 'POST',
      body: JSON.stringify(update),
    }),

  // Get customer balance
  getCustomerBalance: (customerId: number) =>
    apiRequest<ApiResponse<CustomerBalance>>(`/customers/${customerId}/balance`),

  // Sync all customer balances (recalculate from sales)
  syncCustomerBalances: () =>
    apiRequest<ApiResponse<{ updated: number }>>('/customers/sync-balances', {
      method: 'POST',
    }),

  // Update order payment method with balance adjustment
  updateOrderPaymentMethod: (orderId: number, paymentData: { 
    paymentMethod: string;
    customerId?: number;
    previousPaymentMethod: string;
    orderTotal: number;
    orderNumber: string;
  }) =>
    apiRequest<ApiResponse<any>>(`/sales/${orderId}/payment-method`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    }),
};
