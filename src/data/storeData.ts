
// Centralized data for Usman Hardware store

// Product Units
export type ProductUnit = "piece" | "pair" | "box" | "kg" | "liter" | "foot" | "meter";

// Product interface
export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  unit: ProductUnit;
  minStock: number;
  sales: number;
}

// Customer interface
export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  dueAmount: number;
}

// Product Categories
export const categories = [
  { value: "all", label: "All Categories" },
  { value: "hardware", label: "Hardware & Fittings" },
  { value: "fasteners", label: "Screws & Fasteners" },
  { value: "oils", label: "Oils & Spirits" },
  { value: "cement", label: "Cement & Putty" },
  { value: "paints", label: "Paints & Chemicals" },
  { value: "tools", label: "Tools & Equipment" },
  { value: "plumbing", label: "Pipes & Plumbing" },
];

// Units for products
export const units = [
  { value: "piece", label: "Piece" },
  { value: "pair", label: "Pair" },
  { value: "box", label: "Box" },
  { value: "kg", label: "Kilogram" },
  { value: "liter", label: "Liter" },
  { value: "foot", label: "Foot" },
  { value: "meter", label: "Meter" },
];

// Products data
export const products: Product[] = [
  // Hardware & Fittings
  { id: 1, name: "Door Hinges - Heavy Duty", sku: "DH001", price: 450, stock: 15, category: "hardware", unit: "piece", minStock: 5, sales: 45 },
  { id: 2, name: "Cabinet Handles - Chrome", sku: "CH002", price: 250, stock: 28, category: "hardware", unit: "piece", minStock: 10, sales: 38 },
  { id: 3, name: "Drawer Slides - 18 inch", sku: "DS003", price: 850, stock: 12, category: "hardware", unit: "pair", minStock: 8, sales: 22 },
  { id: 4, name: "Window Latches", sku: "WL008", price: 180, stock: 40, category: "hardware", unit: "piece", minStock: 15, sales: 28 },
  { id: 5, name: "Cabinet Lock", sku: "CL005", price: 300, stock: 35, category: "hardware", unit: "piece", minStock: 12, sales: 15 },
  { id: 6, name: "Shelf Support", sku: "SS006", price: 80, stock: 60, category: "hardware", unit: "piece", minStock: 20, sales: 31 },
  { id: 7, name: "Door Knobs - Brass", sku: "DK007", price: 380, stock: 25, category: "hardware", unit: "piece", minStock: 8, sales: 19 },
  
  // Screws & Fasteners (quantity based)
  { id: 8, name: "Wood Screws - 2 inch", sku: "WS004", price: 120, stock: 150, category: "fasteners", unit: "box", minStock: 20, sales: 67 },
  { id: 9, name: "Machine Bolts - M8", sku: "MB005", price: 8, stock: 500, category: "fasteners", unit: "piece", minStock: 100, sales: 120 },
  { id: 10, name: "Wall Plugs", sku: "WP006", price: 2, stock: 1000, category: "fasteners", unit: "piece", minStock: 200, sales: 95 },
  { id: 11, name: "Nails - 1 inch", sku: "N011", price: 5, stock: 2000, category: "fasteners", unit: "piece", minStock: 300, sales: 180 },
  { id: 12, name: "Self-Tapping Screws", sku: "ST012", price: 3, stock: 800, category: "fasteners", unit: "piece", minStock: 150, sales: 85 },
  
  // Oils & Spirits (liquid based)
  { id: 13, name: "Turpentine Oil", sku: "TO007", price: 180, stock: 25, category: "oils", unit: "liter", minStock: 10, sales: 17 },
  { id: 14, name: "White Spirit", sku: "WS009", price: 220, stock: 18, category: "oils", unit: "liter", minStock: 8, sales: 12 },
  { id: 15, name: "Linseed Oil", sku: "LO010", price: 350, stock: 12, category: "oils", unit: "liter", minStock: 5, sales: 8 },
  { id: 16, name: "Engine Oil", sku: "EO016", price: 450, stock: 30, category: "oils", unit: "liter", minStock: 10, sales: 25 },
  
  // Paints & Chemicals (kg/liter based)
  { id: 17, name: "White Cement", sku: "WC011", price: 180, stock: 50, category: "cement", unit: "kg", minStock: 20, sales: 42 },
  { id: 18, name: "Wall Putty", sku: "WP012", price: 280, stock: 35, category: "cement", unit: "kg", minStock: 15, sales: 28 },
  { id: 19, name: "Primer Paint", sku: "PP013", price: 420, stock: 22, category: "paints", unit: "liter", minStock: 10, sales: 18 },
  { id: 20, name: "Emulsion Paint", sku: "EP020", price: 500, stock: 25, category: "paints", unit: "liter", minStock: 12, sales: 23 },
  { id: 21, name: "Enamel Paint", sku: "ENP021", price: 580, stock: 18, category: "paints", unit: "liter", minStock: 8, sales: 15 },
  
  // Tools & Equipment
  { id: 22, name: "Hammer - Claw", sku: "HC014", price: 650, stock: 8, category: "tools", unit: "piece", minStock: 3, sales: 6 },
  { id: 23, name: "Measuring Tape", sku: "MT015", price: 380, stock: 15, category: "tools", unit: "piece", minStock: 5, sales: 12 },
  { id: 24, name: "Screwdriver Set", sku: "SD024", price: 750, stock: 10, category: "tools", unit: "set", minStock: 4, sales: 8 },
  { id: 25, name: "Pliers", sku: "PL025", price: 320, stock: 12, category: "tools", unit: "piece", minStock: 5, sales: 9 },
  
  // Pipes & Fittings (open boxes/bulk)
  { id: 26, name: "PVC Pipe - 1 inch", sku: "PV016", price: 85, stock: 200, category: "plumbing", unit: "foot", minStock: 50, sales: 160 },
  { id: 27, name: "Elbow Joint - 1 inch", sku: "EJ017", price: 25, stock: 80, category: "plumbing", unit: "piece", minStock: 20, sales: 55 },
  { id: 28, name: "T-Joint - 1 inch", sku: "TJ028", price: 35, stock: 70, category: "plumbing", unit: "piece", minStock: 15, sales: 48 },
  { id: 29, name: "Gate Valve - 1 inch", sku: "GV029", price: 320, stock: 25, category: "plumbing", unit: "piece", minStock: 8, sales: 12 },
];

// Customers data
export const customers: Customer[] = [
  { id: 1, name: "Muhammad Ahmed", phone: "0300-1234567", address: "Sagar Road, Hafizabad", dueAmount: 2340 },
  { id: 2, name: "Ali Hassan", phone: "0321-9876543", address: "Gujranwala Road, Hafizabad", dueAmount: 1890 },
  { id: 3, name: "Fatima Khan", phone: "0333-5555555", address: "College Road, Hafizabad", dueAmount: 0 },
  { id: 4, name: "Ahmed Construction", phone: "0345-1111111", address: "Kolo Road, Hafizabad", dueAmount: 5600 },
  { id: 5, name: "Khan Brothers", phone: "0311-2222222", address: "Vanike Tarar, Hafizabad", dueAmount: 3200 },
  { id: 6, name: "Malik Traders", phone: "0333-3333333", address: "Main Bazaar, Hafizabad", dueAmount: 0 },
];
