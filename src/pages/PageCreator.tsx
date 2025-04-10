
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageBuilder } from "@/components/page-builder/PageBuilder";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PageCreator = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <DashboardLayout userType="Brand" userName="Acme Inc.">
      <PageBuilder />
    </DashboardLayout>
  );
};

export default PageCreator;
