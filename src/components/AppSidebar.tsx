
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
  Store,
  TrendingUp,
  Calculator,
  Truck,
  Bell,
  BarChart3,
  Calendar,
  CreditCard,
  UserCheck,
  Database,
  Bookmark,
  PieChart,
  Receipt,
  Target,
  MessageSquare,
  Phone,
  Mail,
  FileBarChart
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Define the menu item type with optional badge
type MenuItem = {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

// Main Menu items
const mainItems: MenuItem[] = [
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
]

// Business Operations
const businessItems: MenuItem[] = [
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Truck,
  },
  {
    title: "Purchase Orders",
    url: "/purchase-orders",
    icon: FileText,
  },
  {
    title: "Sales Receipts",
    url: "/sales-receipts", 
    icon: Receipt,
  },
  {
    title: "Quotations",
    url: "/quotations",
    icon: Calculator,
  },
]

// Financial Management
const financeItems: MenuItem[] = [
  {
    title: "Finance Overview",
    url: "/finance",
    icon: DollarSign,
  },
  {
    title: "Accounts Receivable",
    url: "/accounts-receivable",
    icon: CreditCard,
  },
  {
    title: "Expense Tracking",
    url: "/expense-tracking",
    icon: TrendingUp,
  },
]

// Analytics & Reports
const analyticsItems: MenuItem[] = [
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Sales Analytics",
    url: "/sales-analytics",
    icon: PieChart,
    badge: "Pro"
  },
  {
    title: "Customer Insights",
    url: "/customer-insights",
    icon: UserCheck,
  },
]

// Communication & Tools
const toolsItems: MenuItem[] = [
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    badge: "5"
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Backup & Sync",
    url: "/backup",
    icon: Database,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const handleNavigation = (url: string, title: string) => {
    if (url.startsWith('/')) {
      navigate(url)
    } else {
      toast({
        title: "Coming Soon",
        description: `${title} feature will be available in the next update`,
      });
    }
  }

  const handleSettingsClick = () => {
    navigate("/settings")
  }

  const renderMenuItems = (items: MenuItem[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton 
            asChild
            isActive={location.pathname === item.url}
            className="w-full hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-900"
          >
            <button
              onClick={() => handleNavigation(item.url, item.title)}
              className="flex items-center gap-2 w-full text-left text-slate-700"
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge 
                  className={`text-xs ${
                    item.badge === 'New' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    item.badge === 'Pro' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )

  return (
    <Sidebar className="border-r border-slate-200" collapsible="icon">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white">
            <Store className="h-6 w-6" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-bold text-slate-900">Usman Hardware</h2>
            <p className="text-xs text-slate-600">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="overflow-y-auto">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Business Operations */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700">Business Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(businessItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Financial Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700">Financial Management</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(financeItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analytics & Reports */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700">Analytics & Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(analyticsItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Communication & Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700">Communication & Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(toolsItems)}
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
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
