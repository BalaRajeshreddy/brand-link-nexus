import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from './components/profile/ProfilePage';

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BrandDashboard from "./pages/BrandDashboard";
import QRCreator from "./pages/QRCreator";
import PageCreator from "./pages/PageCreator";
import LandingPagesList from "./pages/LandingPagesList";
import QRCodesList from "./pages/QRCodesList";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Brand Routes */}
          <Route path="/dashboard/brand" element={<BrandDashboard />} />
          <Route path="/dashboard/brand/create-qr" element={<QRCreator />} />
          <Route path="/dashboard/brand/create-page" element={<PageCreator />} />
          <Route path="/dashboard/brand/edit-page/:pageId" element={<PageCreator />} />
          <Route path="/dashboard/brand/landing-pages" element={<LandingPagesList />} />
          <Route path="/dashboard/brand/qr-codes" element={<QRCodesList />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          
          {/* User Routes */}
          <Route path="/dashboard/user" element={<UserDashboard />} />
          
          {/* Profile Route */}
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
