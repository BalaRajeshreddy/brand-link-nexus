import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { FileSelector } from '@/components/FileSelector';
import { MediaLibrary } from '@/components/page-builder/MediaLibrary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function isFileWithUrl(img: unknown): img is { url: string } {
  return typeof img === 'object' && img !== null && 'url' in img && typeof (img as any).url === 'string';
}

function ProductImageInput({ value, onChange, brandId }) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [url, setUrl] = useState(value || '');
  return (
    <div>
      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="library">Select</TabsTrigger>
          <TabsTrigger value="url">Paste URL</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <FileSelector
            type="image"
            onSelect={file => file && (typeof file === 'object' && file !== null && 'url' in file ? onChange(file.url) : onChange(file))}
            brandId={brandId}
            value={value}
          />
        </TabsContent>
        <TabsContent value="library">
          <Button onClick={() => setShowLibrary(true)}>Open Media Library</Button>
          <MediaLibrary
            open={showLibrary}
            onOpenChange={setShowLibrary}
            onSelectImage={img => {
              if (img == null) return;
              if (isFileWithUrl(img)) {
                onChange(img.url);
              } else {
                onChange(img);
              }
              setShowLibrary(false);
            }}
          />
        </TabsContent>
        <TabsContent value="url">
          <Input
            placeholder="Paste image URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onBlur={() => onChange(url)}
          />
        </TabsContent>
      </Tabs>
      {value && <img src={value} alt="Product" className="mt-2 h-24 rounded" />}
    </div>
  );
}

function IngredientsInput({ value, onChange }) {
  const [ingredients, setIngredients] = useState(value || []);
  const handleChange = (idx, field, val) => {
    const updated = ingredients.map((ing, i) =>
      i === idx ? { ...ing, [field]: val } : ing
    );
    setIngredients(updated);
    onChange(updated);
  };
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
    onChange([...ingredients, { name: '', quantity: '' }]);
  };
  const removeIngredient = idx => {
    const updated = ingredients.filter((_, i) => i !== idx);
    setIngredients(updated);
    onChange(updated);
  };
  return (
    <div>
      {ingredients.map((ing, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <Input
            placeholder="Name"
            value={ing.name}
            onChange={e => handleChange(idx, 'name', e.target.value)}
          />
          <Input
            placeholder="Quantity"
            value={ing.quantity}
            onChange={e => handleChange(idx, 'quantity', e.target.value)}
          />
          <Button type="button" onClick={() => removeIngredient(idx)}>Remove</Button>
        </div>
      ))}
      <Button type="button" onClick={addIngredient}>Add Ingredient</Button>
    </div>
  );
}

const BrandProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Brand User');
  const [brandId, setBrandId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [videos, setVideos] = useState(form?.videos || []);
  const [nutritionalInfo, setNutritionalInfo] = useState(form?.nutritional_info || []);
  const [usageInstructions, setUsageInstructions] = useState(form?.usage_instructions || []);
  const [certifications, setCertifications] = useState(form?.certifications || []);
  const [safetyWarnings, setSafetyWarnings] = useState(form?.safety_warnings || '');
  const [manufacturingInfo, setManufacturingInfo] = useState(form?.manufacturing_info || { made_in: '', address: '' });
  const [keyBenefits, setKeyBenefits] = useState(form?.key_benefits || []);
  const [ecommerceLinks, setEcommerceLinks] = useState(form?.ecommerce_links || []);
  const [sustainability, setSustainability] = useState(form?.sustainability || { instructions: '', images: [], videos: [] });
  const [reviews, setReviews] = useState(form?.reviews || []);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'Brand User');
      // Get brand for this user
      let brandIdFetched = null;
      if (user) {
        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (brand) brandIdFetched = brand.id;
      }
      setBrandId(brandIdFetched);
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      setProduct(data);
      // Parse ingredients as array if possible
      let ingredients = [];
      if (data && data.ingredients) {
        try {
          ingredients = typeof data.ingredients === 'string' ? JSON.parse(data.ingredients) : data.ingredients;
        } catch {
          ingredients = [];
        }
      }
      setForm({ ...data, ingredients });
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    supabase
      .from('product_categories')
      .select('*')
      .order('name')
      .then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    if (form && form.category) {
      supabase
        .from('product_subcategories')
        .select('*')
        .eq('category_id', form.category)
        .order('name')
        .then(({ data }) => setSubcategories(data || []));
    } else {
      setSubcategories([]);
    }
  }, [form && form.category]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').update({
      ...form,
      price: form.price ? parseFloat(form.price) : null,
      ingredients: JSON.stringify(form.ingredients),
      nutritional_info: JSON.stringify(nutritionalInfo),
      ecommerce_links: JSON.stringify(ecommerceLinks),
      reviews: JSON.stringify(reviews),
    }).eq('id', id);
    if (!error) {
      alert('Product updated');
      navigate(0); // reload
    } else {
      alert('Error updating product');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      navigate('/dashboard/brand/products');
    } else {
      alert('Error deleting product');
    }
  };

  if (loading) return <DashboardLayout userType="Brand" userName={userName}><div className="p-8">Loading...</div></DashboardLayout>;
  if (!product) return <DashboardLayout userType="Brand" userName={userName}><div className="p-8">Product not found</div></DashboardLayout>;

  return (
    <DashboardLayout userType="Brand" userName={userName}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <form onSubmit={handleSave} className="bg-white p-6 rounded shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Basic Info</h2>
          </div>
          <div>
            <label className="block font-medium">Product Name</label>
            <input name="name" value={form.name || ''} onChange={handleInput} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block font-medium">MRP</label>
            <input name="price" value={form.price || ''} onChange={handleInput} className="w-full border rounded p-2" type="number" step="0.01" required />
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium">Product Description</label>
            <textarea name="description" value={form.description || ''} onChange={handleInput} className="w-full border rounded p-2" rows={3} maxLength={100} required />
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Media</h2>
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium">Product Images</label>
            <ProductImageInput value={form.image} onChange={img => setForm(prev => ({ ...prev, image: img }))} brandId={brandId} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium">Product Videos (YouTube or video URLs, comma separated)</label>
            <input name="videos" value={Array.isArray(videos) ? videos.join(', ') : videos} onChange={e => setVideos(e.target.value.split(',').map(s => s.trim()))} className="w-full border rounded p-2" />
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Category</h2>
          </div>
          <div>
            <label className="block font-medium">Category</label>
            <select
              name="category"
              value={form.category || ''}
              onChange={e => {
                setForm(prev => ({ ...prev, category: e.target.value, subcategory: '' }));
              }}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Subcategory</label>
            <select
              name="subcategory"
              value={form.subcategory || ''}
              onChange={handleInput}
              className="w-full border rounded p-2"
              required={!!form.category}
              disabled={!form.category}
            >
              <option value="">Select subcategory</option>
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Ingredients / Materials</h2>
          </div>
          <div className="md:col-span-2">
            <IngredientsInput value={form.ingredients} onChange={ings => setForm(prev => ({ ...prev, ingredients: ings }))} />
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Nutritional Info (for food brands)</h2>
            <table className="w-full mb-2">
              <thead>
                <tr>
                  <th className="text-left">Nutrient</th>
                  <th className="text-left">Value</th>
                  <th className="text-left">Unit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {nutritionalInfo.map((row, idx) => (
                  <tr key={idx}>
                    <td><input value={row.nutrient || ''} onChange={e => { const updated = [...nutritionalInfo]; updated[idx].nutrient = e.target.value; setNutritionalInfo(updated); }} className="border rounded p-1" /></td>
                    <td><input value={row.value || ''} onChange={e => { const updated = [...nutritionalInfo]; updated[idx].value = e.target.value; setNutritionalInfo(updated); }} className="border rounded p-1" /></td>
                    <td><input value={row.unit || ''} onChange={e => { const updated = [...nutritionalInfo]; updated[idx].unit = e.target.value; setNutritionalInfo(updated); }} className="border rounded p-1" /></td>
                    <td><button type="button" onClick={() => setNutritionalInfo(nutritionalInfo.filter((_, i) => i !== idx))} className="text-red-600">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={() => setNutritionalInfo([...nutritionalInfo, { nutrient: '', value: '', unit: '' }])} className="text-blue-600">Add</button>
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Usage Instructions</h2>
            <textarea name="usage_instructions" value={form.usage_instructions || ''} onChange={handleInput} className="w-full border rounded p-2" rows={2} />
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Certifications</h2>
            <input name="certifications" value={Array.isArray(certifications) ? certifications.join(', ') : certifications} onChange={e => setCertifications(e.target.value.split(',').map(s => s.trim()))} className="w-full border rounded p-2" />
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Safety / Warnings (Optional)</h2>
            <textarea name="safety_warnings" value={safetyWarnings} onChange={e => setSafetyWarnings(e.target.value)} className="w-full border rounded p-2" rows={2} />
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Manufacturing Info</h2>
            <input name="made_in" value={manufacturingInfo.made_in} onChange={e => setManufacturingInfo(prev => ({ ...prev, made_in: e.target.value }))} className="w-full border rounded p-2 mb-2" placeholder="Made In" />
            <input name="address" value={manufacturingInfo.address} onChange={e => setManufacturingInfo(prev => ({ ...prev, address: e.target.value }))} className="w-full border rounded p-2" placeholder="Manufacturing Address" />
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Key Benefits / Features</h2>
            <textarea name="key_benefits" value={Array.isArray(keyBenefits) ? keyBenefits.join('\n') : keyBenefits} onChange={e => setKeyBenefits(e.target.value.split('\n'))} className="w-full border rounded p-2" rows={2} />
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">E-commerce Links</h2>
            {ecommerceLinks.map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input placeholder="Platform (Amazon, Website, etc.)" value={link.platform || ''} onChange={e => { const updated = [...ecommerceLinks]; updated[idx].platform = e.target.value; setEcommerceLinks(updated); }} className="border rounded p-1 flex-1" />
                <input placeholder="Link" value={link.url || ''} onChange={e => { const updated = [...ecommerceLinks]; updated[idx].url = e.target.value; setEcommerceLinks(updated); }} className="border rounded p-1 flex-1" />
                <button type="button" onClick={() => setEcommerceLinks(ecommerceLinks.filter((_, i) => i !== idx))} className="text-red-600">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => setEcommerceLinks([...ecommerceLinks, { platform: '', url: '' }])} className="text-blue-600">Add</button>
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Sustainability & Ethics</h2>
            <textarea name="sustainability_instructions" value={sustainability.instructions} onChange={e => setSustainability(prev => ({ ...prev, instructions: e.target.value }))} className="w-full border rounded p-2" rows={2} placeholder="Recycling/Reuse/Disposal guidance" />
          </div>
          <div className="md:col-span-2">
            <hr className="my-4" />
            <h2 className="text-lg font-semibold mb-2">Reviews & Ratings</h2>
            {reviews.map((review, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input placeholder="Reviewer Name" value={review.name || ''} onChange={e => { const updated = [...reviews]; updated[idx].name = e.target.value; setReviews(updated); }} className="border rounded p-1" />
                <input placeholder="Review" value={review.text || ''} onChange={e => { const updated = [...reviews]; updated[idx].text = e.target.value; setReviews(updated); }} className="border rounded p-1 flex-1" />
                <input type="number" min={1} max={5} placeholder="Rating" value={review.rating || ''} onChange={e => { const updated = [...reviews]; updated[idx].rating = e.target.value; setReviews(updated); }} className="border rounded p-1 w-16" />
                <button type="button" onClick={() => setReviews(reviews.filter((_, i) => i !== idx))} className="text-red-600">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => setReviews([...reviews, { name: '', text: '', rating: 5 }])} className="text-blue-600">Add</button>
          </div>
          <div className="md:col-span-2 flex gap-2 mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
            <button type="button" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={handleDelete}>Delete</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default BrandProductDetail; 