
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageBuilder } from "@/components/page-builder/PageBuilder";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PageCreator = () => {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("...");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

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
          setUserId(user.id); // Store the user ID for saving pages
          setUserEmail(user.email || "");
          // Use email as username if no name is available
          setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "Brand User");
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
  }, [navigate]);

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
      <PageBuilder userId={userId} pageId={pageId} />
    </DashboardLayout>
  );
};

export default PageCreator;
