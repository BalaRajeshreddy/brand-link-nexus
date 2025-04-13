
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { QRGenerator } from "@/components/qr/QRGenerator";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QRCodeData {
  id: string;
  title: string;
  description: string | null;
  url: string;
  landing_page_id: string | null;
  user_id: string;
}

const QRCodeEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [userName, setUserName] = useState("...");
  const [userId, setUserId] = useState("");
  const [qrCodeData, setQRCodeData] = useState<QRCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session) {
          toast.error("You need to be logged in to access this page");
          navigate("/auth");
          return;
        }
        
        // Session exists, get user data
        const { user } = data.session;
        if (user) {
          setUserId(user.id);
          setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "Brand User");
          
          // Fetch QR code data
          const { data: qrCode, error: fetchError } = await supabase
            .from('qr_codes')
            .select('*')
            .eq('id', id)
            .single();
            
          if (fetchError) {
            toast.error("QR code not found");
            navigate("/dashboard/brand/qr-codes");
            return;
          }
          
          setQRCodeData(qrCode);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Authentication failed");
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <DashboardLayout userType="Brand" userName="...">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="Brand" userName={userName}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Edit QR Code</h1>
        </div>
        
        {qrCodeData && (
          <QRGenerator 
            userId={userId} 
            initialPageId={qrCodeData.landing_page_id} 
            qrCodeId={qrCodeData.id}
            initialTitle={qrCodeData.title}
            initialDescription={qrCodeData.description || ""}
            initialUrl={qrCodeData.url}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default QRCodeEdit;
