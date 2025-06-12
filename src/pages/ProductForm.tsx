import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Upload,
  Image as ImageIcon,
  Video,
  AlertCircle,
  CheckCircle2,
  Star,
  Link,
  Leaf,
  Recycle,
  Info,
  Package,
  ShoppingCart,
  Award,
  Shield,
  Factory,
  ThumbsUp,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FileUpload } from '@/components/ui/FileUpload';
import { ProductImageUpload } from '@/components/ui/ProductImageUpload';

interface Category {
  id: string;
  name: string;
  created_at: string;
}

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
}

interface Product {
  id?: string;
  name: string;
  description: string;
  mrp: number;
  category_id: string;
  subcategory_id: string;
  images: string[];
  videos: string[];
  ingredients: string[];
  nutritional_info: Record<string, string>;
  usage_instructions: string[];
  certifications: string[];
  safety_warnings: string;
  manufacturing_info: {
    made_in: string;
    address: string;
  };
  key_benefits: string[];
  ecommerce_links: {
    platform: string;
    url: string;
  }[];
  sustainability: {
    instructions: string;
    images: string[];
    videos: string[];
  };
  reviews: {
    rating: number;
    count: number;
  };
}

interface ValidationErrors {
  [key: string]: string;
}

export function ProductForm() {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [activeSection, setActiveSection] = useState('basic');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const sections = [
    { id: 'basic', title: 'Basic Information', icon: Info, required: ['name', 'description', 'mrp', 'category_id'] },
    { id: 'media', title: 'Media', icon: ImageIcon, required: ['images'] },
    { id: 'details', title: 'Product Details', icon: Package, required: ['ingredients', 'usage_instructions'] },
    { id: 'certifications', title: 'Certifications & Safety', icon: Award, required: ['certifications'] },
    { id: 'manufacturing', title: 'Manufacturing', icon: Factory, required: ['manufacturing_info'] },
    { id: 'benefits', title: 'Benefits & Features', icon: ThumbsUp, required: ['key_benefits'] },
    { id: 'ecommerce', title: 'E-commerce Links', icon: ShoppingCart, required: ['ecommerce_links'] },
    { id: 'sustainability', title: 'Sustainability', icon: Leaf, required: ['sustainability'] },
    { id: 'reviews', title: 'Reviews & Ratings', icon: Star, required: [] },
  ];

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const { data, error } = await supabase
          .from('product_categories')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching categories:', error);
          throw error;
        }

        console.log('Fetched categories:', data);
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error in loadCategories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadSubcategories = async () => {
      if (!product.category_id) {
        setSubcategories([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('product_subcategories')
          .select('*')
          .eq('category_id', product.category_id)
          .order('name');

        if (error) {
          console.error('Error fetching subcategories:', error);
          throw error;
        }

        console.log('Fetched subcategories:', data);
        if (data) {
          setSubcategories(data);
        }

        // Reset subcategory selection if the current one doesn't belong to the new category
        if (product.subcategory_id && !data?.some(sub => sub.id === product.subcategory_id)) {
          setProduct(prev => ({ ...prev, subcategory_id: '' }));
        }
      } catch (error) {
        console.error('Error in loadSubcategories:', error);
        toast.error('Failed to load subcategories');
      }
    };

    loadSubcategories();
  }, [product.category_id]);

  useEffect(() => {
    validateSection(activeSection);
  }, [activeSection, product]);

  const validateSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const errors: ValidationErrors = {};
    section.required.forEach(field => {
      if (!product[field]) {
        errors[field] = 'This field is required';
      }
    });

    setValidationErrors(errors);
    if (Object.keys(errors).length === 0) {
      handleSectionComplete(sectionId);
    }
  };

  const handleSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      calculateProgress();
    }
  };

  const calculateProgress = () => {
    const totalSections = sections.length;
    const completed = completedSections.length;
    setProgress((completed / totalSections) * 100);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsLoading(true);
    try {
      // Implement image upload logic here
      const uploadedUrls = []; // Add uploaded URLs here
      setUploadedImages([...uploadedImages, ...uploadedUrls]);
      setProduct({ ...product, images: [...(product.images || []), ...uploadedUrls] });
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsLoading(true);
    try {
      // Implement video upload logic here
      const uploadedUrls = []; // Add uploaded URLs here
      setUploadedVideos([...uploadedVideos, ...uploadedUrls]);
      setProduct({ ...product, videos: [...(product.videos || []), ...uploadedUrls] });
      toast.success('Videos uploaded successfully');
    } catch (error) {
      console.error('Error uploading videos:', error);
      toast.error('Failed to upload videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Validate all sections
      sections.forEach(section => validateSection(section.id));

      if (Object.keys(validationErrors).length > 0) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Implement form submission logic
      toast.success('Product saved successfully');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const RequiredField = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Progress Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create New Product</CardTitle>
              <CardDescription>Fill in the product details below</CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Form Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-colors",
                      activeSection === section.id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50",
                      validationErrors[section.id] && "border-red-500"
                    )}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{section.title}</span>
                      {completedSections.includes(section.id) && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                      )}
                      {validationErrors[section.id] && (
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                {/* Basic Information */}
                {activeSection === 'basic' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <RequiredField>
                        <Label htmlFor="name">Product Name</Label>
                      </RequiredField>
                      <Input
                        id="name"
                        value={product.name || ''}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        placeholder="Enter product name"
                        className={cn(validationErrors.name && "border-red-500")}
                      />
                      {validationErrors.name && (
                        <p className="text-sm text-red-500">{validationErrors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <RequiredField>
                        <Label htmlFor="description">Product Description</Label>
                      </RequiredField>
                      <Textarea
                        id="description"
                        value={product.description || ''}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        placeholder="Enter product description (max 100 characters)"
                        maxLength={100}
                        className={cn(validationErrors.description && "border-red-500")}
                      />
                      <div className="flex justify-between">
                        <p className="text-sm text-red-500">{validationErrors.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {100 - (product.description?.length || 0)} characters remaining
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <RequiredField>
                        <Label htmlFor="mrp">MRP (₹)</Label>
                      </RequiredField>
                      <Input
                        id="mrp"
                        type="number"
                        value={product.mrp || ''}
                        onChange={(e) => setProduct({ ...product, mrp: parseFloat(e.target.value) })}
                        placeholder="Enter MRP"
                        className={cn(validationErrors.mrp && "border-red-500")}
                      />
                      {validationErrors.mrp && (
                        <p className="text-sm text-red-500">{validationErrors.mrp}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <RequiredField>
                          <Label htmlFor="category">Category</Label>
                        </RequiredField>
                        <Select
                          value={product.category_id}
                          onValueChange={(value) => {
                            console.log('Selected category:', value);
                            setProduct({ 
                              ...product, 
                              category_id: value,
                              subcategory_id: '' // Reset subcategory when category changes
                            });
                          }}
                          disabled={isLoadingCategories}
                        >
                          <SelectTrigger className={cn(validationErrors.category_id && "border-red-500")}>
                            <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.length === 0 ? (
                              <SelectItem value="none" disabled>
                                {isLoadingCategories ? "Loading categories..." : "No categories available"}
                              </SelectItem>
                            ) : (
                              categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {validationErrors.category_id && (
                          <p className="text-sm text-red-500">{validationErrors.category_id}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <RequiredField>
                          <Label htmlFor="subcategory">Subcategory</Label>
                        </RequiredField>
                        <Select
                          value={product.subcategory_id}
                          onValueChange={(value) => setProduct({ ...product, subcategory_id: value })}
                          disabled={!product.category_id || isLoadingCategories}
                        >
                          <SelectTrigger className={cn(validationErrors.subcategory_id && "border-red-500")}>
                            <SelectValue placeholder={
                              !product.category_id 
                                ? "Select a category first" 
                                : subcategories.length === 0 
                                  ? "No subcategories available" 
                                  : "Select subcategory"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {subcategories.length === 0 ? (
                              <SelectItem value="none" disabled>
                                {product.category_id ? "No subcategories available" : "Select a category first"}
                              </SelectItem>
                            ) : (
                              subcategories.map((subcategory) => (
                                <SelectItem key={subcategory.id} value={subcategory.id}>
                                  {subcategory.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {validationErrors.subcategory_id && (
                          <p className="text-sm text-red-500">{validationErrors.subcategory_id}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Section */}
                {activeSection === 'media' && (
                  <TabsContent value="media" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>Upload product images and videos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ProductImageUpload
                          onImagesChange={(images) => {
                            setProduct(prev => ({
                              ...prev,
                              images: images.map(img => img.image),
                              ecommerce_links: images.map(img => ({
                                platform: 'custom',
                                url: img.link
                              }))
                            }));
                          }}
                          initialImages={product.images?.map((img, index) => ({
                            image: img,
                            link: product.ecommerce_links?.[index]?.url || ''
                          })) || []}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Product Videos</CardTitle>
                        <CardDescription>Upload product videos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FileUpload
                          onFileSelect={(url) => {
                            setProduct(prev => ({
                              ...prev,
                              videos: [...(prev.videos || []), url]
                            }));
                          }}
                          accept="video/*"
                          folder="product-videos"
                          maxSize={50}
                        />
                        {product.videos?.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            {product.videos.map((video, index) => (
                              <div key={index} className="relative">
                                <video
                                  src={video}
                                  className="w-full rounded-lg"
                                  controls
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={() => {
                                    setProduct(prev => ({
                                      ...prev,
                                      videos: prev.videos?.filter((_, i) => i !== index)
                                    }));
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {/* Product Details */}
                {activeSection === 'details' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <RequiredField>
                        <Label>Ingredients/Materials</Label>
                      </RequiredField>
                      <div className="space-y-2">
                        {product.ingredients?.map((ingredient, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={ingredient}
                              onChange={(e) => {
                                const newIngredients = [...(product.ingredients || [])];
                                newIngredients[index] = e.target.value;
                                setProduct({ ...product, ingredients: newIngredients });
                              }}
                              placeholder="Enter ingredient or material"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newIngredients = product.ingredients?.filter((_, i) => i !== index);
                                setProduct({ ...product, ingredients: newIngredients });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProduct({
                              ...product,
                              ingredients: [...(product.ingredients || []), '']
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Ingredient
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label>Nutritional Information</Label>
                      <div className="border rounded-lg p-4">
                        <div className="space-y-4">
                          {Object.entries(product.nutritional_info || {}).map(([key, value], index) => (
                            <div key={index} className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Nutrient</Label>
                                <Input
                                  value={key}
                                  onChange={(e) => {
                                    const newInfo = { ...product.nutritional_info };
                                    delete newInfo[key];
                                    newInfo[e.target.value] = value;
                                    setProduct({ ...product, nutritional_info: newInfo });
                                  }}
                                  placeholder="e.g., Protein"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Value</Label>
                                <Input
                                  value={value}
                                  onChange={(e) => {
                                    setProduct({
                                      ...product,
                                      nutritional_info: {
                                        ...product.nutritional_info,
                                        [key]: e.target.value
                                      }
                                    });
                                  }}
                                  placeholder="e.g., 20g"
                                />
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setProduct({
                                ...product,
                                nutritional_info: {
                                  ...product.nutritional_info,
                                  '': ''
                                }
                              });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Nutrient
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <RequiredField>
                        <Label>Usage Instructions</Label>
                      </RequiredField>
                      <div className="space-y-2">
                        {product.usage_instructions?.map((instruction, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="font-medium">{index + 1}.</span>
                            <Input
                              value={instruction}
                              onChange={(e) => {
                                const newInstructions = [...(product.usage_instructions || [])];
                                newInstructions[index] = e.target.value;
                                setProduct({ ...product, usage_instructions: newInstructions });
                              }}
                              placeholder="Enter instruction step"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newInstructions = product.usage_instructions?.filter((_, i) => i !== index);
                                setProduct({ ...product, usage_instructions: newInstructions });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProduct({
                              ...product,
                              usage_instructions: [...(product.usage_instructions || []), '']
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Step
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications & Safety */}
                {activeSection === 'certifications' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <RequiredField>
                        <Label>Certifications</Label>
                      </RequiredField>
                      <div className="grid grid-cols-2 gap-4">
                        {['FSSAI', 'Organic', 'Vegan', 'ISO', 'BIS'].map((cert) => (
                          <div key={cert} className="flex items-center space-x-2">
                            <Checkbox
                              id={cert}
                              checked={product.certifications?.includes(cert)}
                              onCheckedChange={(checked) => {
                                const newCerts = checked
                                  ? [...(product.certifications || []), cert]
                                  : product.certifications?.filter(c => c !== cert);
                                setProduct({ ...product, certifications: newCerts });
                              }}
                            />
                            <Label htmlFor={cert}>{cert}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label>Safety Warnings</Label>
                      <Textarea
                        placeholder="Enter any safety warnings or precautions"
                        value={product.safety_warnings || ''}
                        onChange={(e) => setProduct({ ...product, safety_warnings: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Manufacturing */}
                {activeSection === 'manufacturing' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <RequiredField>
                        <Label>Made In</Label>
                      </RequiredField>
                      <Input
                        placeholder="Enter country of origin"
                        value={product.manufacturing_info?.made_in || ''}
                        onChange={(e) => setProduct({
                          ...product,
                          manufacturing_info: {
                            ...product.manufacturing_info,
                            made_in: e.target.value
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-4">
                      <RequiredField>
                        <Label>Manufacturing Address</Label>
                      </RequiredField>
                      <Textarea
                        placeholder="Enter manufacturing address"
                        value={product.manufacturing_info?.address || ''}
                        onChange={(e) => setProduct({
                          ...product,
                          manufacturing_info: {
                            ...product.manufacturing_info,
                            address: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                )}

                {/* Benefits & Features */}
                {activeSection === 'benefits' && (
                  <div className="space-y-6">
                    <RequiredField>
                      <Label>Key Benefits & Features</Label>
                    </RequiredField>
                    <div className="space-y-2">
                      {product.key_benefits?.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={benefit}
                            onChange={(e) => {
                              const newBenefits = [...(product.key_benefits || [])];
                              newBenefits[index] = e.target.value;
                              setProduct({ ...product, key_benefits: newBenefits });
                            }}
                            placeholder="Enter benefit or feature"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newBenefits = product.key_benefits?.filter((_, i) => i !== index);
                              setProduct({ ...product, key_benefits: newBenefits });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProduct({
                            ...product,
                            key_benefits: [...(product.key_benefits || []), '']
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Benefit
                      </Button>
                    </div>
                  </div>
                )}

                {/* E-commerce Links */}
                {activeSection === 'ecommerce' && (
                  <div className="space-y-6">
                    <RequiredField>
                      <Label>E-commerce Links</Label>
                    </RequiredField>
                    <div className="space-y-4">
                      {['Shopify', 'Amazon', 'Website', 'Flipkart'].map((platform) => (
                        <div key={platform} className="space-y-2">
                          <Label>{platform}</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder={`Enter ${platform} URL`}
                              value={product.ecommerce_links?.find(link => link.platform === platform)?.url || ''}
                              onChange={(e) => {
                                const newLinks = [...(product.ecommerce_links || [])];
                                const existingIndex = newLinks.findIndex(link => link.platform === platform);
                                if (existingIndex >= 0) {
                                  newLinks[existingIndex] = { platform, url: e.target.value };
                                } else {
                                  newLinks.push({ platform, url: e.target.value });
                                }
                                setProduct({ ...product, ecommerce_links: newLinks });
                              }}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const url = product.ecommerce_links?.find(link => link.platform === platform)?.url;
                                if (url) window.open(url, '_blank');
                              }}
                            >
                              <Link className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sustainability */}
                {activeSection === 'sustainability' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <RequiredField>
                        <Label>Recycling Instructions</Label>
                      </RequiredField>
                      <Textarea
                        placeholder="Enter recycling, reuse, or disposal instructions"
                        value={product.sustainability?.instructions || ''}
                        onChange={(e) => setProduct({
                          ...product,
                          sustainability: {
                            ...product.sustainability,
                            instructions: e.target.value
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Sustainability Images</Label>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="sustainability-image-upload"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('sustainability-image-upload')?.click()}
                            disabled={isLoading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isLoading ? 'Uploading...' : 'Upload Images'}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {product.sustainability?.images?.map((url, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                            <img
                              src={url}
                              alt={`Sustainability image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                const newImages = product.sustainability?.images?.filter((_, i) => i !== index);
                                setProduct({
                                  ...product,
                                  sustainability: {
                                    ...product.sustainability,
                                    images: newImages
                                  }
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label>Sustainability Videos</Label>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleVideoUpload}
                            className="hidden"
                            id="sustainability-video-upload"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('sustainability-video-upload')?.click()}
                            disabled={isLoading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isLoading ? 'Uploading...' : 'Upload Videos'}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {product.sustainability?.videos?.map((url, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                            <video
                              src={url}
                              controls
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                const newVideos = product.sustainability?.videos?.filter((_, i) => i !== index);
                                setProduct({
                                  ...product,
                                  sustainability: {
                                    ...product.sustainability,
                                    videos: newVideos
                                  }
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews & Ratings */}
                {activeSection === 'reviews' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>Current Rating</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-6 w-6 ${
                                star <= (product.reviews?.rating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews?.count || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading || progress < 100}
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </div>
  );
} 