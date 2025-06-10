import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Building2, User, Lock, Briefcase, Users, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface RegisterFormProps {
  userType: string;
}

export function RegisterForm({ userType }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [designation, setDesignation] = useState('');
  const [otherDesignation, setOtherDesignation] = useState('');
  const [mobile, setMobile] = useState('');
  const [industryCategory, setIndustryCategory] = useState('');
  const [otherIndustry, setOtherIndustry] = useState('');
  const [numEmployees, setNumEmployees] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const designations = [
    'Founder', 'Co-Founder', 'CEO', 'Managing Director', 'CMO (Chief Marketing Officer)',
    'Head of Marketing', 'Head of Sales', 'Brand Manager', 'Product Manager',
    'Growth / Performance Marketing Manager', 'Customer Success / Support Lead',
    'Digital Marketing Manager', 'Operations Manager', 'Technical Head / IT Manager',
    'Business Development Manager', 'Other'
  ];
  const industryCategories = [
    'Food & Beverages', 'Personal Care', 'Household Products', 'Packaged Goods',
    'Apparel & Fashion', 'Footwear', 'Toys & Baby Product', 'Mobile & Accessories',
    'Appliances', 'Audio Devices', 'Smart Home & IoT Devices', 'Gadgets & Wearables',
    'Nutraceuticals', 'Skincare & Cosmetics', 'Ayurveda & Herbal Products',
    'Pharmaceuticals', 'Furniture', 'Home Decor', 'Kitchenware', 'Cleaning & Utility',
    'Auto Parts', 'EV Products', 'Accessories & Lubricants', 'Pet Products',
    'Stationery & Office Supplies', 'Art & Handicrafts', 'Subscription Boxes', 'Other'
  ];
  const employeeOptions = [
    '1–10 employees', '11–50 employees', '51–100 employees', '101–250 employees',
    '251–500 employees', '501–1,000 employees', '1,001–5,000 employees',
    '5,001–10,000 employees', '10,000+ employees'
  ];

  // Add progress tracking
  const [activeSection, setActiveSection] = useState('basic-info');
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const sections = userType === 'Brand' 
    ? ['basic-info', 'contact-info', 'professional-info', 'security']
    : ['user-info', 'security'];

  const calculateProgress = () => {
    return (completedSections.length / sections.length) * 100;
  };

  const checkSectionCompletion = (section: string) => {
    switch (section) {
      case 'basic-info':
        return name && firstName && lastName;
      case 'contact-info':
        return email && mobile;
      case 'professional-info':
        return designation && industryCategory && numEmployees;
      case 'security':
        return password.length >= 8;
      case 'user-info':
        return name && email;
      default:
        return false;
    }
  };

  // Add this new function to update progress
  const updateProgress = () => {
    const newCompletedSections = sections.filter(section => checkSectionCompletion(section));
    setCompletedSections(newCompletedSections);
  };

  // Update all the onChange handlers to call updateProgress
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    updateProgress();
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    updateProgress();
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    updateProgress();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    updateProgress();
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(e.target.value);
    updateProgress();
  };

  const handleDesignationChange = (value: string) => {
    setDesignation(value);
    updateProgress();
  };

  const handleIndustryCategoryChange = (value: string) => {
    setIndustryCategory(value);
    updateProgress();
  };

  const handleNumEmployeesChange = (value: string) => {
    setNumEmployees(value);
    updateProgress();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    updateProgress();
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (checkSectionCompletion(section) && !completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth',
          data: {
            name,
            userType,
            ...(userType === 'Brand' && {
              category,
              firstName,
              lastName,
              designation: designation === 'Other' ? otherDesignation : designation,
              mobile,
              industryCategory: industryCategory === 'Other' ? otherIndustry : industryCategory,
              numEmployees
            })
          }
        }
      });

      if (authError) {
        toast.error("Registration failed: " + authError.message);
        setIsLoading(false);
        return;
      }

      if (!authData?.user?.id) {
        toast.error("Registration failed: No user ID received");
        setIsLoading(false);
        return;
      }

      // Wait a moment to ensure the user is created
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (userType === 'Brand') {
        // Create brand profile only for brand users
        const { error: brandInsertError } = await supabase.from('brands').insert({
          user_id: authData.user.id,
          name,
          email,
          contact_first_name: firstName,
          contact_last_name: lastName,
          contact_email: email,
          contact_mobile: mobile,
          designation: designation === 'Other' ? otherDesignation : designation,
          industry_category: industryCategory === 'Other' ? otherIndustry : industryCategory,
          num_employees: numEmployees,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Profile fields (empty/default for now)
          logo: '',
          description: '',
          website: '',
          gst_number: '',
          founded_year: '',
          hq_location: '',
          whatsapp_support: '',
          social_handles: {},
          support_email: '',
          support_phone: '',
          team_members: [],
          product_categories: [],
        });

        if (brandInsertError) {
          console.error('Brand insert error:', brandInsertError);
          toast.error("Failed to create brand profile. Please try again.");
          // Attempt to delete the user account since brand creation failed
          await supabase.auth.admin.deleteUser(authData.user.id);
          setIsLoading(false);
          return;
        }
      } else {
        // Create user profile for regular users
        const { error: userInsertError } = await supabase.from('users').insert({
          id: authData.user.id,
          email,
          password, // Note: This should be hashed in production
          role: 'CUSTOMER',
          first_name: name.split(' ')[0] || '', // Split full name into first name
          last_name: name.split(' ').slice(1).join(' ') || '', // Rest of the name as last name
          phone: '', // Optional field
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        if (userInsertError) {
          console.error('User insert error:', userInsertError);
          // Check for specific error messages
          if (userInsertError.code === '23505' && userInsertError.message.includes('users_email_key')) {
            toast.error("This email is already registered. Please try logging in instead.");
          } else {
            toast.error("Failed to create user profile. Please try again.");
          }
          // Attempt to delete the user account since user creation failed
          await supabase.auth.admin.deleteUser(authData.user.id);
          setIsLoading(false);
          return;
        }
      }

      toast.success(`Successfully registered as ${userType}. Please check your email for verification.`);
      // Redirect based on user type
      const redirectPath = userType === 'Brand' 
        ? '/dashboard/brand' 
        : userType === 'Admin' 
          ? '/dashboard/admin' 
          : '/dashboard/user';
      navigate(redirectPath);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Progress value={calculateProgress()} className="w-full" />
            <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          {sections.map((section) => (
            <div key={section} className="flex items-center gap-1">
              {completedSections.includes(section) ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
              )}
              <span className="capitalize">{section.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Accordion 
          type="single" 
          collapsible 
          className="w-full"
          value={activeSection}
          onValueChange={handleSectionChange}
        >
          {userType === 'Brand' ? (
            <>
              {/* Basic Information */}
              <AccordionItem value="basic-info">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <span>Basic Information</span>
                    {completedSections.includes('basic-info') && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Brand Name</Label>
        <Input
          id="name"
                          placeholder="Your brand name" 
          value={name}
                          onChange={handleNameChange}
                          required 
                          className="transition-all focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="First Name" 
                            value={firstName} 
                            onChange={handleFirstNameChange}
                            required 
                            className="transition-all focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Last Name" 
                            value={lastName} 
                            onChange={handleLastNameChange}
          required
                            className="transition-all focus:ring-2 focus:ring-primary"
        />
      </div>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              {/* Contact Information */}
              <AccordionItem value="contact-info">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span>Contact Information</span>
                    {completedSections.includes('contact-info') && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-6">
                    <div className="space-y-4">
      <div className="space-y-2">
                        <Label htmlFor="email">Official Email</Label>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          value={email}
                          onChange={handleEmailChange}
                          required 
                          className="transition-all focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input 
                          id="mobile" 
                          placeholder="Mobile Number" 
                          type="tel" 
                          value={mobile} 
                          onChange={handleMobileChange}
          required
                          className="transition-all focus:ring-2 focus:ring-primary"
        />
      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              {/* Professional Information */}
              <AccordionItem value="professional-info">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Professional Information</span>
                    {completedSections.includes('professional-info') && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Select value={designation} onValueChange={handleDesignationChange} required>
                          <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                          <SelectContent>
                            {designations.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {designation === 'Other' && (
                          <Input 
                            placeholder="Please specify" 
                            value={otherDesignation} 
                            onChange={e => setOtherDesignation(e.target.value)} 
                            required 
                            className="mt-2 transition-all focus:ring-2 focus:ring-primary"
                          />
                        )}
                      </div>
        <div className="space-y-2">
                        <Label htmlFor="industryCategory">Industry Category</Label>
                        <Select value={industryCategory} onValueChange={handleIndustryCategoryChange} required>
                          <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
                            {industryCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
                        {industryCategory === 'Other' && (
                          <Input 
                            placeholder="Please specify" 
                            value={otherIndustry} 
                            onChange={e => setOtherIndustry(e.target.value)} 
                            required 
                            className="mt-2 transition-all focus:ring-2 focus:ring-primary"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numEmployees">Number of Employees</Label>
                        <Select value={numEmployees} onValueChange={handleNumEmployeesChange} required>
                          <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select number of employees" />
                          </SelectTrigger>
                          <SelectContent>
                            {employeeOptions.map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </>
          ) : (
            <AccordionItem value="user-info">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>User Information</span>
                  {completedSections.includes('user-info') && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={handleNameChange}
                        required 
                        className="transition-all focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        placeholder="name@example.com" 
                        type="email" 
                        value={email} 
                        onChange={handleEmailChange}
                        required 
                        className="transition-all focus:ring-2 focus:ring-primary"
                      />
                    </div>
        </div>
                </Card>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Account Security */}
          <AccordionItem value="security">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <span>Account Security</span>
                {completedSections.includes('security') && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-6">
                <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
                      onChange={handlePasswordChange}
          required
                      className="transition-all focus:ring-2 focus:ring-primary"
        />
                    <p className="text-sm text-muted-foreground">
                      Password must be at least 8 characters long
                    </p>
                  </div>
      </div>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg" 
          disabled={isLoading || completedSections.length !== sections.length}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating Account...
            </div>
          ) : (
            `Register as ${userType}`
          )}
      </Button>
    </form>
    </div>
  );
}
