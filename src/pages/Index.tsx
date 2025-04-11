import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode, LayoutPanelLeft, BarChart2, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-indigo">QR Nexus</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-indigo/10 to-primary-blue/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Create Custom QR Codes & Landing Pages
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Simplify your marketing with dynamic QR codes and beautiful landing pages for your brand.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg">Create Your First QR Code</Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg">Explore Templates</Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-3xl">
              <div className="absolute -top-6 -left-6 -right-6 -bottom-6 rounded-xl bg-primary-blue/5 -z-10 animate-float"></div>
              <img 
                src="https://placehold.co/800x400/png"
                alt="QR Code Builder Interface" 
                className="rounded-lg shadow-2xl border border-gray-200 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Powerful features for your brand</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="dashboard-card">
              <div className="mb-4 p-2 bg-primary-blue/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <QrCode className="text-primary-blue h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom QR Codes</h3>
              <p className="text-muted-foreground">
                Create branded QR codes with custom colors, logos, and frames that align with your brand identity.
              </p>
            </div>
            
            <div className="dashboard-card">
              <div className="mb-4 p-2 bg-primary-green/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <LayoutPanelLeft className="text-primary-green h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Landing Page Builder</h3>
              <p className="text-muted-foreground">
                Build responsive landing pages with an intuitive drag-and-drop editor. No coding required.
              </p>
            </div>
            
            <div className="dashboard-card">
              <div className="mb-4 p-2 bg-primary-orange/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <BarChart2 className="text-primary-orange h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Track scans, views, and engagement with comprehensive analytics for all your QR codes and pages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-indigo py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of brands already using QR Nexus to connect with their customers.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-primary-indigo hover:bg-white/90">Create Free Account</Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-primary-indigo">QR Nexus</h2>
              <p className="text-muted-foreground mt-1">© 2025 QR Nexus. All rights reserved.</p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
