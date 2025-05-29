
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Database, Cloud, Download, Upload, CheckCircle, AlertCircle, Clock, HardDrive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BackupSync = () => {
  const { toast } = useToast();

  const handleBackup = () => {
    toast({
      title: "Backup Started",
      description: "Your data backup has been initiated successfully.",
    });
  };

  const handleSync = () => {
    toast({
      title: "Sync Complete",
      description: "Data synchronized with cloud storage.",
    });
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 min-h-screen bg-slate-50">
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Backup & Sync</h1>
          <p className="text-slate-600">Manage your data backup and synchronization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Status */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Backup Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last Backup</span>
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Today, 2:30 AM
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Backup Size</span>
              <span className="text-sm font-medium">2.4 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Storage Used</span>
              <span className="text-sm font-medium">15.6 GB / 50 GB</span>
            </div>
            <Progress value={31} className="w-full" />
            <Button onClick={handleBackup} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Create Backup Now
            </Button>
          </CardContent>
        </Card>

        {/* Cloud Sync */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-600" />
              Cloud Synchronization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Sync Status</span>
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Up to Date
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last Sync</span>
              <span className="text-sm font-medium">5 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Auto Sync</span>
              <Badge className="text-green-600 bg-green-100 border-green-200">Enabled</Badge>
            </div>
            <Button onClick={handleSync} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          </CardContent>
        </Card>

        {/* Backup History */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Backup History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "Today, 2:30 AM", size: "2.4 GB", status: "success" },
                { date: "Yesterday, 2:30 AM", size: "2.3 GB", status: "success" },
                { date: "Nov 26, 2:30 AM", size: "2.2 GB", status: "success" },
                { date: "Nov 25, 2:30 AM", size: "2.1 GB", status: "warning" },
              ].map((backup, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded border">
                  <div className="flex items-center gap-3">
                    {backup.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{backup.date}</p>
                      <p className="text-xs text-slate-500">Size: {backup.size}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackupSync;
