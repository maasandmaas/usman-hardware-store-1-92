
import { SidebarTrigger } from "@/components/ui/sidebar";
import DynamicReports from "@/components/reports/DynamicReports";

const Reports = () => {
  return (
    <div className="flex-1 p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
            <p className="text-slate-600">Comprehensive business analytics and reports</p>
          </div>
        </div>
      </div>

      <DynamicReports />
    </div>
  );
};

export default Reports;
