
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageBuilder } from "@/components/page-builder/PageBuilder";

const PageCreator = () => {
  return (
    <DashboardLayout userType="Brand" userName="Acme Inc.">
      <PageBuilder />
    </DashboardLayout>
  );
};

export default PageCreator;
