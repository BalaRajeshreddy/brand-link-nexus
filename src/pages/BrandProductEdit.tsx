import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FileSelector } from '@/components/FileSelector';
import { MediaLibrary } from '@/components/page-builder/MediaLibrary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ProductForm {
  name: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  price: string;
  ecommerce_links: string[];
  ingredients: Array<{ name: string; quantity: string; unit: string }>;
  ingredients_data: string;
  allergens: Array<{ name: string; type_code: string; contains: string }>;
  allergen_spec_agency: string;
  allergen_spec_name: string;
  allergen_statement: string;
  recycling_type: string;
  how_to_recycle: string;
  is_recyclable: boolean | null;
  recycle_count: string;
  cooking_steps: Array<{ instruction: string; video_url: string; image: string }>;
  serve_with: string;
  suggest_product: string;
  can_be_used_with: string;
  weight: string;
  weight_unit: string;
  batch_number: string;
  media_url: string;
  certifications: string[];
  faqs: string[];
  reviews: Array<{ name: string; text: string; rating: number }>;
  buy_links: Array<{ label: string; url: string }>;
}

interface NutritionalInfo {
  nutrient: string;
  value: string;
  unit: string;
  per_quantity: string;
}

const BrandProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Brand User');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo[]>([]);
  const [ecommerceLinks, setEcommerceLinks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    image: '',
    images: [],
    category: '',
    subcategory: '',
    price: '',
    ecommerce_links: [],
    ingredients: [],
    ingredients_data: '',
    allergens: [],
    allergen_spec_agency: '',
    allergen_spec_name: '',
    allergen_statement: '',
    recycling_type: '',
    how_to_recycle: '',
    is_recyclable: null,
    recycle_count: '',
    cooking_steps: [],
    serve_with: '',
    suggest_product: '',
    can_be_used_with: '',
    weight: '',
    weight_unit: 'Kg',
    batch_number: '',
    media_url: '',
    certifications: [],
    faqs: [],
    reviews: [],
    buy_links: [],
  });

  const sectionOptions = [
    { value: 'basic', label: 'Product Basic Information' },
    { value: 'ingredients', label: 'Ingredients Information' },
    { value: 'nutrition', label: 'Nutritional Information' },
    { value: 'allergens', label: 'Allergens Information' },
    { value: 'recycling', label: 'Recycling Information' },
    { value: 'cooking', label: 'Cooking Information' },
    { value: 'suggestions', label: 'Product Suggestions' },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (product) {
          setForm({
            name: product.name || '',
            description: product.description || '',
            image: product.image || '',
            images: Array.isArray(product.images) ? product.images : [],
            category: product.category_id || '',
            subcategory: product.subcategory_id || '',
            price: product.price || '',
            ecommerce_links: Array.isArray(product.ecommerce_links) ? product.ecommerce_links : [],
            ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
            ingredients_data: product.ingredients_data || '',
            allergens: Array.isArray(product.allergens) ? product.allergens : [],
            allergen_spec_agency: product.allergen_spec_agency || '',
            allergen_spec_name: product.allergen_spec_name || '',
            allergen_statement: product.allergen_statement || '',
            recycling_type: product.recycling_type || '',
            how_to_recycle: product.how_to_recycle || '',
            is_recyclable: product.is_recyclable,
            recycle_count: product.recycle_count || '',
            cooking_steps: Array.isArray(product.cooking_steps) ? product.cooking_steps : [],
            serve_with: product.serve_with || '',
            suggest_product: product.suggest_product || '',
            can_be_used_with: product.can_be_used_with || '',
            weight: product.weight || '',
            weight_unit: product.weight_unit || 'Kg',
            batch_number: product.batch_number || '',
            media_url: product.media_url || '',
            certifications: Array.isArray(product.certifications) ? product.certifications : [],
            faqs: Array.isArray(product.faqs) ? product.faqs : [],
            reviews: Array.isArray(product.reviews) ? product.reviews : [],
            buy_links: Array.isArray(product.ecommerce_links)
              ? product.ecommerce_links
              : (typeof product.ecommerce_links === 'string' && product.ecommerce_links
                  ? JSON.parse(product.ecommerce_links)
                  : []),
          });

          setNutritionalInfo(Array.isArray(product.nutritional_info) ? product.nutritional_info : []);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    supabase
      .from('product_categories')
      .select('*')
      .order('name')
      .then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    if (form.category) {
      supabase
        .from('product_subcategories')
        .select('*')
        .eq('category_id', form.category)
        .order('name')
        .then(({ data }) => setSubcategories(data || []));
    } else {
      setSubcategories([]);
    }
  }, [form.category]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const uploadImages = async () => {
    const uploads: Promise<{ path: string; type: 'main' | 'additional' | 'cooking'; index?: number }>[] = [];

    // Upload main image if changed
    if (form.image && form.image.startsWith('data:')) {
      uploads.push(
        supabase.storage
          .from('product-images')
          .upload(`${id}/main-image`, form.image.split(',')[1], {
            contentType: 'image/jpeg',
            upsert: true
          })
          .then(({ data, error }) => {
            if (error) throw error;
            return { path: data.path, type: 'main' as const };
          })
      );
    }

    // Upload additional images if changed
    form.images.forEach((img, index) => {
      if (img.startsWith('data:')) {
        uploads.push(
          supabase.storage
            .from('product-images')
            .upload(`${id}/image-${index}`, img.split(',')[1], {
              contentType: 'image/jpeg',
              upsert: true
            })
            .then(({ data, error }) => {
              if (error) throw error;
              return { path: data.path, type: 'additional' as const, index };
            })
        );
      }
    });

    // Upload cooking step images if changed
    form.cooking_steps.forEach((step, index) => {
      if (step.image && step.image.startsWith('data:')) {
        uploads.push(
          supabase.storage
            .from('product-images')
            .upload(`${id}/cooking-step-${index}`, step.image.split(',')[1], {
              contentType: 'image/jpeg',
              upsert: true
            })
            .then(({ data, error }) => {
              if (error) throw error;
              return { path: data.path, type: 'cooking' as const, index };
            })
        );
      }
    });

    const results = await Promise.all(uploads);
    
    // Update form with uploaded image paths
    const newForm = { ...form };
    
    results.forEach(result => {
      if (result.type === 'main') {
        newForm.image = result.path;
      } else if (result.type === 'additional' && result.index !== undefined) {
        newForm.images[result.index] = result.path;
      } else if (result.type === 'cooking' && result.index !== undefined) {
        newForm.cooking_steps[result.index] = {
          ...newForm.cooking_steps[result.index],
          image: result.path
        };
      }
    });

    setForm(newForm);
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images first and update form with URLs
      await uploadImages();

      // Basic product data with updated image URLs
      const updateData = {
        name: form.name,
        description: form.description,
        image: form.image,
        images: Array.isArray(form.images) ? form.images : [],
        category_id: form.category ? form.category : null,
        subcategory_id: form.subcategory ? form.subcategory : null,
        price: form.price ? parseFloat(form.price) : null,
        ecommerce_links: JSON.stringify(form.buy_links),
        ingredients: Array.isArray(form.ingredients) ? form.ingredients : [],
        ingredients_data: form.ingredients_data,
        allergens: Array.isArray(form.allergens) ? form.allergens : [],
        allergen_spec_agency: form.allergen_spec_agency,
        allergen_spec_name: form.allergen_spec_name,
        allergen_statement: form.allergen_statement,
        recycling_type: form.recycling_type,
        how_to_recycle: form.how_to_recycle,
        is_recyclable: form.is_recyclable,
        recycle_count: form.recycle_count ? parseInt(form.recycle_count) : null,
        cooking_steps: Array.isArray(form.cooking_steps) ? form.cooking_steps : [],
        serve_with: form.serve_with,
        suggest_product: form.suggest_product,
        can_be_used_with: form.can_be_used_with,
        weight: form.weight ? parseFloat(form.weight) : null,
        weight_unit: form.weight_unit,
        batch_number: form.batch_number,
        media_url: form.media_url,
        certifications: Array.isArray(form.certifications) ? form.certifications : [],
        faqs: Array.isArray(form.faqs) ? form.faqs : [],
        nutritional_info: Array.isArray(nutritionalInfo) ? nutritionalInfo : [],
        reviews: Array.isArray(form.reviews) ? form.reviews : [],
      };

      // Update product in database
      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      toast.success('Product updated successfully');
      navigate('/dashboard/brand/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (result && typeof result === 'string') {
        setForm(prev => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const readers = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (result && typeof result === 'string') {
            resolve(result);
          } else {
            reject(new Error('Failed to read file as data URL'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then(results => {
        setForm(prev => ({ ...prev, images: [...prev.images, ...results] }));
      })
      .catch(error => {
        console.error('Error reading files:', error);
        toast.error('Failed to read some files');
      });
  };

  const handleCookingStepImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (result && typeof result === 'string') {
        const updated = [...(form.cooking_steps || [])];
        updated[index] = { ...updated[index], image: result };
        setForm(prev => ({ ...prev, cooking_steps: updated }));
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <DashboardLayout userType="Brand" userName={userName}>
        <div className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="Brand" userName={userName}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/brand/products')}
          >
            Back to Products
          </Button>
        </div>
        <form onSubmit={handleUpdateProduct}>
          <Card className="p-8 w-full max-w-4xl mb-12">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="font-semibold text-lg">Edit Product Details</div>
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full md:w-80">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {sectionOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Details (Left) */}
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-1">Product Name<span className="text-red-500">*</span></label>
                    <Input name="name" value={form.name} onChange={handleInput} className="w-full" required placeholder="Enter product name" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Description<span className="text-red-500">*</span></label>
                    <Textarea name="description" value={form.description} onChange={handleInput} className="w-full" required placeholder="Enter product description" rows={3} />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block font-semibold mb-1">Product Weight<span className="text-red-500">*</span></label>
                      <Input name="weight" value={form.weight || ''} onChange={handleInput} className="w-full" placeholder="e.g. 500" />
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold mb-1">Unit</label>
                      <select name="weight_unit" value={form.weight_unit || 'Kg'} onChange={handleInput} className="w-full border rounded p-2">
                        <option value="Kg">Kg</option>
                        <option value="g">g</option>
                        <option value="mg">mg</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Price<span className="text-red-500">*</span></label>
                    <Input name="price" value={form.price || ''} onChange={handleInput} className="w-full" placeholder="e.g. 100" type="number" min="0" step="0.01" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Batch Number</label>
                    <Input name="batch_number" value={form.batch_number || ''} onChange={handleInput} className="w-full" placeholder="Enter batch number" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Category<span className="text-red-500">*</span></label>
                    <Select
                      name="category"
                      value={form.category}
                      onValueChange={value => setForm(prev => ({ ...prev, category: value, subcategory: '' }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Subcategory</label>
                    <Select
                      name="subcategory"
                      value={form.subcategory}
                      onValueChange={value => setForm(prev => ({ ...prev, subcategory: value }))}
                      disabled={!form.category}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories
                          .filter(sub => sub.category_id === form.category)
                          .map(sub => (
                            <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 mt-4">Reviews</label>
                    {form.reviews && form.reviews.length > 0 && form.reviews.map((review, idx) => (
                      <div key={idx} className="flex gap-2 mb-2 items-center">
                        <input placeholder="Reviewer Name" value={review.name || ''} onChange={e => { const updated = [...form.reviews]; updated[idx].name = e.target.value; setForm(prev => ({ ...prev, reviews: updated })); }} className="border rounded p-1" />
                        <input placeholder="Review" value={review.text || ''} onChange={e => { const updated = [...form.reviews]; updated[idx].text = e.target.value; setForm(prev => ({ ...prev, reviews: updated })); }} className="border rounded p-1 flex-1" />
                        <input type="number" min={1} max={5} placeholder="Rating" value={review.rating || ''} onChange={e => { const updated = [...form.reviews]; updated[idx].rating = Number(e.target.value); setForm(prev => ({ ...prev, reviews: updated })); }} className="border rounded p-1 w-16" />
                        <button type="button" onClick={() => setForm(prev => ({ ...prev, reviews: prev.reviews.filter((_, i) => i !== idx) }))} className="text-red-600">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, reviews: [...(prev.reviews || []), { name: '', text: '', rating: 5 }] }))} className="text-blue-600">Add Review</button>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 mt-4">Buy Links</label>
                    {form.buy_links && form.buy_links.length > 0 && form.buy_links.map((link, idx) => (
                      <div key={idx} className="flex gap-2 mb-2 items-center">
                        <input placeholder="Label (e.g. Amazon)" value={link.label || ''} onChange={e => { const updated = [...form.buy_links]; updated[idx].label = e.target.value; setForm(prev => ({ ...prev, buy_links: updated })); }} className="border rounded p-1" />
                        <input placeholder="URL" value={link.url || ''} onChange={e => { const updated = [...form.buy_links]; updated[idx].url = e.target.value; setForm(prev => ({ ...prev, buy_links: updated })); }} className="border rounded p-1 flex-1" />
                        <button type="button" onClick={() => setForm(prev => ({ ...prev, buy_links: prev.buy_links.filter((_, i) => i !== idx) }))} className="text-red-600">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, buy_links: [...(prev.buy_links || []), { label: '', url: '' }] }))} className="text-blue-600">Add Buy Link</button>
                  </div>
                </div>

                {/* Product Images/Videos (Right) */}
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-1">Products Images/Videos</label>
                    <div className="flex gap-4 items-center">
                      {form.image && (
                        <div className="relative">
                          <img src={form.image} alt="Product" className="w-24 h-24 rounded object-cover border" />
                          <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center" onClick={() => setForm(prev => ({ ...prev, image: '' }))}>×</button>
                        </div>
                      )}
                      <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded cursor-pointer hover:border-blue-400 transition-colors">
                        <span className="text-gray-400 text-2xl">+</span>
                        <span className="text-xs text-gray-500">Upload</span>
                        <input type="file" accept="image/*,video/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">URL</label>
                    <Input name="media_url" value={form.media_url || ''} onChange={handleInput} className="w-full" placeholder="Paste image or video URL" />
                  </div>
                </div>
              </div>
            )}

            {/* Ingredients Tab */}
            {activeTab === 'ingredients' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Ingredients</h2>
                  <label className="block font-semibold mb-1">Ingredients data</label>
                  <Textarea
                    name="ingredients_data"
                    value={form.ingredients_data || ''}
                    onChange={handleInput}
                    className="w-full mb-6"
                    placeholder="Enter ingredients data or notes"
                    rows={3}
                  />
                  <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-2 text-left">Ingredient Name</th>
                          <th className="p-2 text-left">Quantity Contained</th>
                          <th className="p-2 text-left">Measurement Unit</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.ingredients.map((ing, idx) => (
                          <tr key={idx}>
                            <td className="p-2">
                              <Input
                                placeholder="e.g. Wheat flour"
                                value={ing.name}
                                onChange={e => {
                                  const updated = [...form.ingredients];
                                  updated[idx].name = e.target.value;
                                  setForm(prev => ({ ...prev, ingredients: updated }));
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                placeholder="e.g. 100"
                                value={ing.quantity}
                                onChange={e => {
                                  const updated = [...form.ingredients];
                                  updated[idx].quantity = e.target.value;
                                  setForm(prev => ({ ...prev, ingredients: updated }));
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <select
                                value={ing.unit || 'g'}
                                onChange={e => {
                                  const updated = [...form.ingredients];
                                  updated[idx].unit = e.target.value;
                                  setForm(prev => ({ ...prev, ingredients: updated }));
                                }}
                                className="w-full border rounded p-2"
                              >
                                <option value="g">g</option>
                                <option value="mg">mg</option>
                                <option value="kg">kg</option>
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                              </select>
                            </td>
                            <td className="p-2">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  const updated = form.ingredients.filter((_, i) => i !== idx);
                                  setForm(prev => ({ ...prev, ingredients: updated }));
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Button
                      type="button"
                      className="mt-4"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          ingredients: [
                            ...prev.ingredients,
                            { name: '', quantity: '', unit: 'g' }
                          ]
                        }));
                      }}
                    >
                      Add Ingredient
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Nutritional Facts</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-2 text-left">Nutrients Name</th>
                          <th className="p-2 text-left">Contains</th>
                          <th className="p-2 text-left">Measurement Unit</th>
                          <th className="p-2 text-left">Per Quantity</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {nutritionalInfo.map((row, idx) => (
                          <tr key={idx}>
                            <td className="p-2">
                              <Input
                                placeholder="e.g. Energy"
                                value={row.nutrient || ''}
                                onChange={e => {
                                  const updated = [...nutritionalInfo];
                                  updated[idx].nutrient = e.target.value;
                                  setNutritionalInfo(updated);
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                placeholder="e.g. 100"
                                value={row.value || ''}
                                onChange={e => {
                                  const updated = [...nutritionalInfo];
                                  updated[idx].value = e.target.value;
                                  setNutritionalInfo(updated);
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <select
                                value={row.unit || 'g'}
                                onChange={e => {
                                  const updated = [...nutritionalInfo];
                                  updated[idx].unit = e.target.value;
                                  setNutritionalInfo(updated);
                                }}
                                className="w-full border rounded p-2"
                              >
                                <option value="g">g</option>
                                <option value="mg">mg</option>
                                <option value="kg">kg</option>
                                <option value="kcal">kcal</option>
                                <option value="%">%</option>
                              </select>
                            </td>
                            <td className="p-2">
                              <Input
                                placeholder="e.g. 100"
                                value={row.per_quantity || ''}
                                onChange={e => {
                                  const updated = [...nutritionalInfo];
                                  updated[idx].per_quantity = e.target.value;
                                  setNutritionalInfo(updated);
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  setNutritionalInfo(nutritionalInfo.filter((_, i) => i !== idx));
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Button
                      type="button"
                      className="mt-4"
                      onClick={() => {
                        setNutritionalInfo([
                          ...nutritionalInfo,
                          { nutrient: '', value: '', unit: 'g', per_quantity: '' }
                        ]);
                      }}
                    >
                      Add Nutrient
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Allergens Tab */}
            {activeTab === 'allergens' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Allergen Related Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block font-semibold mb-1">Allergen Specification Agency</label>
                      <Input name="allergen_spec_agency" value={form.allergen_spec_agency || ''} onChange={handleInput} className="w-full" placeholder="Enter agency" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Allergen Specification Name</label>
                      <Input name="allergen_spec_name" value={form.allergen_spec_name || ''} onChange={handleInput} className="w-full" placeholder="Enter name" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Allergen Statement</label>
                      <Input name="allergen_statement" value={form.allergen_statement || ''} onChange={handleInput} className="w-full" placeholder="Enter statement" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-2 text-left">Allergen Name</th>
                          <th className="p-2 text-left">Allergen Type Code</th>
                          <th className="p-2 text-left">Contains</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(form.allergens || []).map((row, idx) => (
                          <tr key={idx}>
                            <td className="p-2">
                              <Input
                                placeholder="e.g. Peanuts"
                                value={row.name || ''}
                                onChange={e => {
                                  const updated = [...(form.allergens || [])];
                                  updated[idx].name = e.target.value;
                                  setForm(prev => ({ ...prev, allergens: updated }));
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                placeholder="e.g. AP"
                                value={row.type_code || ''}
                                onChange={e => {
                                  const updated = [...(form.allergens || [])];
                                  updated[idx].type_code = e.target.value;
                                  setForm(prev => ({ ...prev, allergens: updated }));
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <select
                                value={row.contains || 'May Contain'}
                                onChange={e => {
                                  const updated = [...(form.allergens || [])];
                                  updated[idx].contains = e.target.value;
                                  setForm(prev => ({ ...prev, allergens: updated }));
                                }}
                                className="w-full border rounded p-2"
                              >
                                <option value="May Contain">May Contain</option>
                                <option value="Contains">Contains</option>
                                <option value="Free From">Free From</option>
                              </select>
                            </td>
                            <td className="p-2">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  const updated = (form.allergens || []).filter((_, i) => i !== idx);
                                  setForm(prev => ({ ...prev, allergens: updated }));
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Button
                      type="button"
                      className="mt-4"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          allergens: [
                            ...(prev.allergens || []),
                            { name: '', type_code: '', contains: 'May Contain' }
                          ]
                        }));
                      }}
                    >
                      Add Allergen
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Recycling Tab */}
            {activeTab === 'recycling' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Products Recycle Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block font-semibold mb-1">Recycling type<span className="text-red-500">*</span></label>
                      <Input name="recycling_type" value={form.recycling_type || ''} onChange={handleInput} className="w-full" placeholder="Enter recycling type" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">How to Recycle<span className="text-red-500">*</span></label>
                      <Textarea name="how_to_recycle" value={form.how_to_recycle || ''} onChange={handleInput} className="w-full" placeholder="Enter recycling instructions" rows={2} />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mb-6">
                    <div>
                      <label className="block font-semibold mb-1">Is it recyclable?</label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={form.is_recyclable === true} onChange={e => setForm(prev => ({ ...prev, is_recyclable: e.target.checked }))} /> Yes
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={form.is_recyclable === false} onChange={e => setForm(prev => ({ ...prev, is_recyclable: !e.target.checked }))} /> No
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Number of times Recyclable</label>
                      <Input name="recycle_count" value={form.recycle_count || ''} onChange={handleInput} className="w-full" placeholder="e.g. 5" type="number" min="0" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cooking Tab */}
            {activeTab === 'cooking' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Cooking Instructions</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-2 text-left">Step No.</th>
                          <th className="p-2 text-left">Cooking Step</th>
                          <th className="p-2 text-left">Video URL</th>
                          <th className="p-2 text-left">Upload Image</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(form.cooking_steps || []).map((step, idx) => (
                          <tr key={idx}>
                            <td className="p-2">{idx + 1}</td>
                            <td className="p-2">
                              <Input
                                placeholder="e.g. Boil 150ml water in a pan"
                                value={step.instruction || ''}
                                onChange={e => {
                                  const updated = [...(form.cooking_steps || [])];
                                  updated[idx] = { ...updated[idx], instruction: e.target.value };
                                  setForm(prev => ({ ...prev, cooking_steps: updated }));
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                placeholder="Video URL"
                                value={step.video_url || ''}
                                onChange={e => {
                                  const updated = [...(form.cooking_steps || [])];
                                  updated[idx] = { ...updated[idx], video_url: e.target.value };
                                  setForm(prev => ({ ...prev, cooking_steps: updated }));
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleCookingStepImageChange(e, idx)}
                                className="border rounded p-1 w-full"
                              />
                              {step.image && <img src={step.image} alt="Step" className="mt-2 h-12 rounded" />}
                            </td>
                            <td className="p-2">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  const updated = (form.cooking_steps || []).filter((_, i) => i !== idx);
                                  setForm(prev => ({ ...prev, cooking_steps: updated }));
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Button
                      type="button"
                      className="mt-4"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          cooking_steps: [
                            ...(prev.cooking_steps || []),
                            { instruction: '', video_url: '', image: '' }
                          ]
                        }));
                      }}
                    >
                      Add Cooking Step
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Product Suggestions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block font-semibold mb-1">Serve with</label>
                      <Input name="serve_with" value={form.serve_with || ''} onChange={handleInput} className="w-full" placeholder="e.g. Chutney" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Suggest product</label>
                      <Input name="suggest_product" value={form.suggest_product || ''} onChange={handleInput} className="w-full" placeholder="e.g. Tea" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Can be used with</label>
                      <Input name="can_be_used_with" value={form.can_be_used_with || ''} onChange={handleInput} className="w-full" placeholder="e.g. Bread" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-2 flex justify-end gap-4 mt-8">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard/brand/products')}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 text-white">Update Product</Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BrandProductEdit; 