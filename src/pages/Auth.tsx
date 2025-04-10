
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthTabs } from "@/components/auth/AuthTabs";

const Auth = () => {
  const [userType, setUserType] = useState<string>("Brand");
  
  const handleUserTypeChange = (type: string) => {
    setUserType(type);
  };

  return (
    <AuthLayout 
      title="Welcome to QR Nexus" 
      subtitle="Sign in to continue to your account"
    >
      <AuthTabs 
        userTypes={["Brand", "User", "Admin"]} 
        onUserTypeChange={handleUserTypeChange}
      />
    </AuthLayout>
  );
};

export default Auth;
