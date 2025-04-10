
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { QRGenerator } from "@/components/qr/QRGenerator";

const QRCreator = () => {
  return (
    <DashboardLayout userType="Brand" userName="Acme Inc.">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Create QR Code</h1>
        </div>
        
        <QRGenerator />
      </div>
    </DashboardLayout>
  );
};

export default QRCreator;
