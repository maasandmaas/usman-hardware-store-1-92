
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
  Bookmark
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Main Menu items
const mainItems = [
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
const businessItems = [
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
    icon: FileText,
  },
  {
    title: "Quotations",
    url: "/quotations",
    icon: Calculator,
  },
]

// Financial Management
const financeItems = [
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
const analyticsItems = [
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Sales Analytics",
    url: "/sales-analytics",
    icon: TrendingUp,
    badge: "Pro"
  },
  {
    title: "Customer Insights",
    url: "/customer-insights",
    icon: UserCheck,
  },
]

// Admin Tools
const adminItems = [
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

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white">
            <Store className="h-6 w-6" />
          </div>
          <div>
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
            <SidebarMenu>
              {mainItems.map((item) => (
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
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Business Operations */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700">Business Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessItems.map((item) => (
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
                            'bg-blue-100 text-blue-800 border-blue-200'
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
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Financial Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700">Financial Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeItems.map((item) => (
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
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analytics & Reports */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700">Analytics & Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
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
                            item.badge === 'Pro' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            'bg-blue-100 text-blue-800 border-blue-200'
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
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-700">Admin Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
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
                          className="text-xs bg-red-100 text-red-800 border-red-200"
                        >
                          {item.badge}
                        </Badge>
                      )}
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
