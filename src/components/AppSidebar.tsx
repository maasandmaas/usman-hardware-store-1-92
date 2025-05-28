
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Warehouse, 
  DollarSign, 
  FileText,
  Settings,
  Store
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },
  {
    title: "Sales (POS)",
    url: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Warehouse,
  },
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Users,
  },
  {
    title: "Purchase Orders",
    url: "/purchase-orders",
    icon: FileText,
  },
  {
    title: "Sales Receipts",
    url: "/sales-receipts", 
    icon: FileText,
  },
  {
    title: "Finance",
    url: "/finance",
    icon: DollarSign,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "Settings panel will be available in the next update",
    });
  }

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Usman Hardware</h2>
            <p className="text-xs text-slate-600">Hafizabad, Punjab</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="w-full hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-900"
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="flex items-center gap-2 w-full text-left text-slate-700"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button 
                className="flex items-center gap-2 w-full text-left text-slate-700 hover:bg-blue-50"
                onClick={handleSettingsClick}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
