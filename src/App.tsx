
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import SalesReceipts from "./pages/SalesReceipts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gray-50">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/purchase-orders" element={<PurchaseOrders />} />
                  <Route path="/sales-receipts" element={<SalesReceipts />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
