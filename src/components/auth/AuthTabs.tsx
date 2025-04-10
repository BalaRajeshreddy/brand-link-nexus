
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthTabsProps {
  userTypes: string[];
  onUserTypeChange: (userType: string) => void;
}

export function AuthTabs({ userTypes, onUserTypeChange }: AuthTabsProps) {
  const [formType, setFormType] = useState<"login" | "register">("login");
  const [userType, setUserType] = useState<string>(userTypes[0]);

  const handleUserTypeChange = (value: string) => {
    setUserType(value);
    onUserTypeChange(value);
  };

  return (
    <div>
      <Tabs defaultValue={formType} onValueChange={(v) => setFormType(v as "login" | "register")} className="mb-6">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <Tabs defaultValue={userType} onValueChange={handleUserTypeChange} className="mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            {userTypes.map((type) => (
              <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <TabsContent value="login">
          <LoginForm userType={userType} />
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm userType={userType} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
