import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { QRGenerator } from "@/components/qr/QRGenerator";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const QRCreator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { qrid } = useParams();
  const [userName, setUserName] = useState("...");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editQRData, setEditQRData] = useState(null);
  
  // Get pageId from query params if provided
  const queryParams = new URLSearchParams(location.search);
  const pageId = queryParams.get('pageId');

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
        }
        // If editing, fetch QR code data
        if (qrid) {
          const { data: qr, error: qrError } = await supabase
            .from('qr_codes')
            .select('*')
            .eq('id', qrid)
            .single();
          if (!qrError && qr) {
            setEditQRData(qr);
          }
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
  }, [navigate, qrid]);

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
          <h1 className="text-2xl font-bold tracking-tight">{qrid ? 'Edit QR Code' : 'Create QR Code'}</h1>
        </div>
        
        <QRGenerator userId={userId} initialPageId={null} editQRData={editQRData} />
      </div>
    </DashboardLayout>
  );
};

export default QRCreator;
