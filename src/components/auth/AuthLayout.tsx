
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">QR Nexus</h1>
          <p className="text-sm text-muted-foreground">Create QR codes and landing pages</p>
        </div>
        
        <Card className="rounded-xl card-shadow border-0">
          <CardContent className="pt-6">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
