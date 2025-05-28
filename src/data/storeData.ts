
export type ProductUnit = 'piece' | 'kg' | 'liter' | 'meter' | 'box' | 'pack' | 'bottle' | 'bag' | 'roll' | 'sheet';

export type ProductCategory = 'hardware' | 'electrical' | 'plumbing' | 'tools' | 'paints' | 'building_materials' | 'safety' | 'automotive';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  unit: ProductUnit;
  description: string;
  supplier: string;
  minStock: number;
  maxStock: number;
  lastUpdated: string;
  image?: string;
  barcode?: string;
  isPinned?: boolean;
  salesCount?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  creditLimit: number;
  currentDue: number;
  totalPurchases: number;
  lastPurchase: string;
  customerType: 'regular' | 'wholesale' | 'retail';
  status: 'active' | 'inactive';
  cnic?: string;
  email?: string;
  notes?: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'credit' | 'bank_transfer';
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  time: string;
}

// Centralized Products Data
export const products: Product[] = [
  {
    id: 'PRD001',
    name: 'Steel Door Hinges - Heavy Duty',
    category: 'hardware',
    price: 250,
    stock: 45,
    unit: 'piece',
    description: 'High-quality steel door hinges for heavy doors',
    supplier: 'Ahmed Steel Works',
    minStock: 20,
    maxStock: 100,
    lastUpdated: '2024-01-15',
    barcode: '123456789012',
    isPinned: true,
    salesCount: 156
  },
  {
    id: 'PRD002',
    name: 'Cabinet Handles - Chrome Finish',
    category: 'hardware',
    price: 180,
    stock: 78,
    unit: 'piece',
    description: 'Modern chrome cabinet handles',
    supplier: 'Malik Hardware Suppliers',
    minStock: 25,
    maxStock: 150,
    lastUpdated: '2024-01-14',
    barcode: '123456789013',
    salesCount: 89
  },
  {
    id: 'PRD003',
    name: 'PVC Pipe 4 inch',
    category: 'plumbing',
    price: 450,
    stock: 32,
    unit: 'meter',
    description: 'High-grade PVC pipe for drainage',
    supplier: 'Lahore Pipe Industries',
    minStock: 15,
    maxStock: 80,
    lastUpdated: '2024-01-13',
    barcode: '123456789014',
    isPinned: true,
    salesCount: 234
  },
  {
    id: 'PRD004',
    name: 'Wall Paint - White Emulsion',
    category: 'paints',
    price: 1250,
    stock: 24,
    unit: 'liter',
    description: 'Premium quality white emulsion paint',
    supplier: 'Diamond Paints Karachi',
    minStock: 10,
    maxStock: 50,
    lastUpdated: '2024-01-12',
    barcode: '123456789015',
    salesCount: 67
  },
  {
    id: 'PRD005',
    name: 'Portland Cement',
    category: 'building_materials',
    price: 680,
    stock: 120,
    unit: 'bag',
    description: 'High-grade Portland cement 50kg bag',
    supplier: 'Fauji Cement Company',
    minStock: 50,
    maxStock: 200,
    lastUpdated: '2024-01-11',
    barcode: '123456789016',
    isPinned: true,
    salesCount: 445
  },
  {
    id: 'PRD006',
    name: 'Electric Wire 2.5mm',
    category: 'electrical',
    price: 85,
    stock: 200,
    unit: 'meter',
    description: 'Copper electric wire 2.5mm for house wiring',
    supplier: 'Pak Elektron Wires',
    minStock: 100,
    maxStock: 500,
    lastUpdated: '2024-01-10',
    barcode: '123456789017',
    salesCount: 178
  },
  {
    id: 'PRD007',
    name: 'Hammer - 500g',
    category: 'tools',
    price: 420,
    stock: 18,
    unit: 'piece',
    description: 'Professional claw hammer with wooden handle',
    supplier: 'Sialkot Tools Manufacturing',
    minStock: 15,
    maxStock: 40,
    lastUpdated: '2024-01-09',
    barcode: '123456789018',
    salesCount: 34
  },
  {
    id: 'PRD008',
    name: 'Safety Helmet',
    category: 'safety',
    price: 650,
    stock: 25,
    unit: 'piece',
    description: 'Industrial safety helmet - yellow',
    supplier: 'Safety First Pakistan',
    minStock: 20,
    maxStock: 60,
    lastUpdated: '2024-01-08',
    barcode: '123456789019',
    salesCount: 28
  },
  {
    id: 'PRD009',
    name: 'Engine Oil - 5W30',
    category: 'automotive',
    price: 2100,
    stock: 15,
    unit: 'bottle',
    description: 'Premium engine oil 4 liters',
    supplier: 'Total Oil Pakistan',
    minStock: 10,
    maxStock: 30,
    lastUpdated: '2024-01-07',
    barcode: '123456789020',
    salesCount: 52
  },
  {
    id: 'PRD010',
    name: 'Steel Rods - 12mm',
    category: 'building_materials',
    price: 95,
    stock: 500,
    unit: 'kg',
    description: 'Construction steel rods',
    supplier: 'Ittefaq Steel Mills',
    minStock: 200,
    maxStock: 1000,
    lastUpdated: '2024-01-06',
    barcode: '123456789021',
    isPinned: true,
    salesCount: 678
  },
  {
    id: 'PRD011',
    name: 'Ceramic Tiles',
    category: 'building_materials',
    price: 45,
    stock: 800,
    unit: 'piece',
    description: 'Glazed ceramic floor tiles 12x12 inch',
    supplier: 'Master Tiles Gujranwala',
    minStock: 100,
    maxStock: 1200,
    lastUpdated: '2024-01-05',
    barcode: '123456789022',
    salesCount: 234
  },
  {
    id: 'PRD012',
    name: 'Wood Stain - Dark Brown',
    category: 'paints',
    price: 890,
    stock: 18,
    unit: 'liter',
    description: 'Premium wood stain for furniture',
    supplier: 'Berger Paints Pakistan',
    minStock: 12,
    maxStock: 40,
    lastUpdated: '2024-01-04',
    barcode: '123456789023',
    salesCount: 41
  },
  {
    id: 'PRD013',
    name: 'Electrical Switches',
    category: 'electrical',
    price: 125,
    stock: 65,
    unit: 'piece',
    description: 'Modern electrical switches with plates',
    supplier: 'Schneider Electric Pakistan',
    minStock: 30,
    maxStock: 100,
    lastUpdated: '2024-01-03',
    barcode: '123456789024',
    salesCount: 98
  },
  {
    id: 'PRD014',
    name: 'Screwdriver Kit',
    category: 'tools',
    price: 750,
    stock: 22,
    unit: 'pack',
    description: 'Professional screwdriver kit with 12 pieces',
    supplier: 'Stanley Tools Pakistan',
    minStock: 15,
    maxStock: 50,
    lastUpdated: '2024-01-02',
    barcode: '123456789025',
    salesCount: 45
  },
  {
    id: 'PRD015',
    name: 'Waterproof Membrane',
    category: 'building_materials',
    price: 1250,
    stock: 12,
    unit: 'roll',
    description: 'Waterproof membrane for roof protection',
    supplier: 'Sika Pakistan',
    minStock: 8,
    maxStock: 25,
    lastUpdated: '2024-01-01',
    barcode: '123456789026',
    salesCount: 23
  }
];

// Centralized Customers Data
export const customers: Customer[] = [
  {
    id: 'CUST001',
    name: 'Muhammad Afzal Construction',
    phone: '+92-300-1234567',
    address: 'Main Bazaar, Near Jamia Mosque',
    city: 'Hafizabad',
    area: 'Main Bazaar',
    creditLimit: 50000,
    currentDue: 12340,
    totalPurchases: 125000,
    lastPurchase: '2024-01-15',
    customerType: 'wholesale',
    status: 'active',
    cnic: '33101-1234567-8',
    email: 'afzal.construction@gmail.com',
    notes: 'Regular wholesale customer, payment usually within 30 days'
  },
  {
    id: 'CUST002',
    name: 'Shahid Furniture Works',
    phone: '+92-301-9876543',
    address: 'Furniture Market, Circular Road',
    city: 'Hafizabad',
    area: 'Circular Road',
    creditLimit: 30000,
    currentDue: 8500,
    totalPurchases: 85000,
    lastPurchase: '2024-01-14',
    customerType: 'wholesale',
    status: 'active',
    cnic: '33101-9876543-2',
    email: 'shahid.furniture@yahoo.com'
  },
  {
    id: 'CUST003',
    name: 'Fatima Home Builders',
    phone: '+92-302-5555666',
    address: 'Satellite Town, Block A',
    city: 'Hafizabad',
    area: 'Satellite Town',
    creditLimit: 75000,
    currentDue: 15600,
    totalPurchases: 200000,
    lastPurchase: '2024-01-13',
    customerType: 'wholesale',
    status: 'active',
    cnic: '33101-5555666-9',
    notes: 'Premium customer, always pays on time'
  },
  {
    id: 'CUST004',
    name: 'Ali Electrical Shop',
    phone: '+92-303-7777888',
    address: 'Electrical Market, GT Road',
    city: 'Hafizabad',
    area: 'GT Road',
    creditLimit: 25000,
    currentDue: 5200,
    totalPurchases: 45000,
    lastPurchase: '2024-01-12',
    customerType: 'retail',
    status: 'active',
    cnic: '33101-7777888-5'
  },
  {
    id: 'CUST005',
    name: 'Usman Plumbing Services',
    phone: '+92-304-9999000',
    address: 'New City, Main Street',
    city: 'Hafizabad',
    area: 'New City',
    creditLimit: 20000,
    currentDue: 3400,
    totalPurchases: 32000,
    lastPurchase: '2024-01-11',
    customerType: 'retail',
    status: 'active',
    cnic: '33101-9999000-7',
    email: 'usman.plumbing@hotmail.com'
  },
  {
    id: 'CUST006',
    name: 'Ahmed Paint Contractor',
    phone: '+92-305-1111222',
    address: 'Industrial Area, Street 5',
    city: 'Hafizabad',
    area: 'Industrial Area',
    creditLimit: 40000,
    currentDue: 0,
    totalPurchases: 78000,
    lastPurchase: '2024-01-10',
    customerType: 'wholesale',
    status: 'active',
    cnic: '33101-1111222-3',
    notes: 'Seasonal customer, mostly active during summer'
  },
  {
    id: 'CUST007',
    name: 'Zain Hardware Store',
    phone: '+92-306-3333444',
    address: 'Old Bazaar, Shop No. 15',
    city: 'Hafizabad',
    area: 'Old Bazaar',
    creditLimit: 35000,
    currentDue: 7800,
    totalPurchases: 95000,
    lastPurchase: '2024-01-09',
    customerType: 'wholesale',
    status: 'active',
    cnic: '33101-3333444-1'
  },
  {
    id: 'CUST008',
    name: 'Bismillah Construction Co.',
    phone: '+92-307-5555777',
    address: 'Model Town, Phase 2',
    city: 'Hafizabad',
    area: 'Model Town',
    creditLimit: 100000,
    currentDue: 25600,
    totalPurchases: 350000,
    lastPurchase: '2024-01-08',
    customerType: 'wholesale',
    status: 'active',
    cnic: '33101-5555777-6',
    email: 'bismillah.construction@gmail.com',
    notes: 'Largest customer, VIP treatment required'
  }
];

// Sample Sales Data
export const sales: Sale[] = [
  {
    id: 'SALE001',
    customerId: 'CUST001',
    customerName: 'Muhammad Afzal Construction',
    items: [
      {
        productId: 'PRD001',
        productName: 'Steel Door Hinges - Heavy Duty',
        quantity: 5,
        price: 250,
        total: 1250
      },
      {
        productId: 'PRD003',
        productName: 'PVC Pipe 4 inch',
        quantity: 10,
        price: 450,
        total: 4500
      }
    ],
    subtotal: 5750,
    discount: 250,
    tax: 0,
    total: 5500,
    paymentMethod: 'credit',
    status: 'completed',
    date: '2024-01-15',
    time: '10:30 AM'
  },
  {
    id: 'SALE002',
    customerId: 'CASH',
    customerName: 'Walk-in Customer',
    items: [
      {
        productId: 'PRD004',
        productName: 'Wall Paint - White Emulsion',
        quantity: 2,
        price: 1250,
        total: 2500
      }
    ],
    subtotal: 2500,
    discount: 0,
    tax: 0,
    total: 2500,
    paymentMethod: 'cash',
    status: 'completed',
    date: '2024-01-15',
    time: '11:15 AM'
  }
];
