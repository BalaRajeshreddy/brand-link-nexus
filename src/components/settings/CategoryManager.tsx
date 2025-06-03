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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Search, Pencil, ChevronRight, FolderOpen } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
  id: string;
  name: string;
  created_at: string;
  subcategory_count?: number;
}

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSubCategoryOpen, setIsAddSubCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isEditSubCategoryOpen, setIsEditSubCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory.id);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      // First fetch all categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Then fetch all subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('product_subcategories')
        .select('category_id');

      if (subcategoriesError) throw subcategoriesError;

      // Count subcategories for each category
      const countMap = new Map<string, number>();
      subcategoriesData.forEach(sub => {
        countMap.set(sub.category_id, (countMap.get(sub.category_id) || 0) + 1);
      });

      // Add counts to categories
      const categoriesWithCounts = categoriesData.map(category => ({
        ...category,
        subcategory_count: countMap.get(category.id) || 0
      }));

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_subcategories')
        .select('*')
        .eq('category_id', categoryId)
        .order('name');

      if (error) throw error;
      setSubCategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .insert([{ name: newCategoryName.trim() }])
        .select();

      if (error) throw error;

      setCategories([...categories, data[0]]);
      setNewCategoryName('');
      setIsAddCategoryOpen(false);
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategoryName.trim() || !selectedCategory) {
      toast.error('Subcategory name and category are required');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_subcategories')
        .insert([{ 
          name: newSubCategoryName.trim(),
          category_id: selectedCategory.id
        }])
        .select();

      if (error) throw error;

      setSubCategories([...subCategories, data[0]]);
      // Update the category's subcategory count
      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, subcategory_count: (cat.subcategory_count || 0) + 1 }
          : cat
      ));
      setNewSubCategoryName('');
      setIsAddSubCategoryOpen(false);
      toast.success('Subcategory added successfully');
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast.error('Failed to add subcategory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('product_categories')
        .update({ name: editingCategory.name.trim() })
        .eq('id', editingCategory.id);

      if (error) throw error;

      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? { ...cat, name: editingCategory.name.trim() } : cat
      ));
      setIsEditCategoryOpen(false);
      setEditingCategory(null);
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubCategory = async () => {
    if (!editingSubCategory || !editingSubCategory.name.trim()) {
      toast.error('Subcategory name is required');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('product_subcategories')
        .update({ name: editingSubCategory.name.trim() })
        .eq('id', editingSubCategory.id);

      if (error) throw error;

      setSubCategories(subCategories.map(sub => 
        sub.id === editingSubCategory.id ? { ...sub, name: editingSubCategory.name.trim() } : sub
      ));
      setIsEditSubCategoryOpen(false);
      setEditingSubCategory(null);
      toast.success('Subcategory updated successfully');
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error('Failed to update subcategory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all associated subcategories.')) {
      return;
    }

    setIsLoading(true);
    try {
      // First delete all subcategories
      const { error: subError } = await supabase
        .from('product_subcategories')
        .delete()
        .eq('category_id', categoryId);

      if (subError) throw subError;

      // Then delete the category
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      setCategories(categories.filter(cat => cat.id !== categoryId));
      if (selectedCategory && selectedCategory.id === categoryId) {
        setSelectedCategory(null);
        setSubCategories([]);
      }
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    setIsLoading(true);
    try {
      const subCategory = subCategories.find(sub => sub.id === subCategoryId);
      if (!subCategory) throw new Error('Subcategory not found');

      const { error } = await supabase
        .from('product_subcategories')
        .delete()
        .eq('id', subCategoryId);

      if (error) throw error;

      setSubCategories(subCategories.filter(sub => sub.id !== subCategoryId));
      // Update the category's subcategory count
      setCategories(categories.map(cat => 
        cat.id === subCategory.category_id 
          ? { ...cat, subcategory_count: Math.max(0, (cat.subcategory_count || 0) - 1) }
          : cat
      ));
      toast.success('Subcategory deleted successfully');
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Failed to delete subcategory');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubCategories = subCategories.filter(subCategory =>
    subCategory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Categories Section */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Select a category to manage its subcategories</CardDescription>
            </div>
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Enter the name for your new product category
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category Name</Label>
                    <Input
                      id="category"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory} disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Category'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedCategory?.id === category.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {category.subcategory_count || 0} subcategories
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(category);
                          setIsEditCategoryOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  {searchQuery ? 'No categories found matching your search' : 'No categories found'}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Subcategories Section */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {selectedCategory ? (
                  <div className="flex items-center gap-2">
                    <span>Subcategories</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-primary">{selectedCategory.name}</span>
                  </div>
                ) : (
                  'Subcategories'
                )}
              </CardTitle>
              <CardDescription>
                {selectedCategory
                  ? 'Manage subcategories for the selected category'
                  : 'Select a category to manage its subcategories'}
              </CardDescription>
            </div>
            {selectedCategory && (
              <Button
                onClick={() => setIsAddSubCategoryOpen(true)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          {selectedCategory ? (
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {filteredSubCategories.map((subCategory) => (
                  <div
                    key={subCategory.id}
                    className="p-4 rounded-lg border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{subCategory.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingSubCategory(subCategory);
                          setIsEditSubCategoryOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSubCategory(subCategory.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredSubCategories.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No subcategories found. Click "Add Subcategory" to create one.
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a category to view its subcategories
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Subcategory Dialog */}
      <Dialog open={isAddSubCategoryOpen} onOpenChange={setIsAddSubCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subcategory</DialogTitle>
            <DialogDescription>
              Add a new subcategory to {selectedCategory?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory Name</Label>
              <Input
                id="subcategory"
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
                placeholder="Enter subcategory name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubCategory} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Subcategory'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category Name</Label>
              <Input
                id="edit-category"
                value={editingCategory?.name || ''}
                onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Enter category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={isEditSubCategoryOpen} onOpenChange={setIsEditSubCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>
              Update the subcategory name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-subcategory">Subcategory Name</Label>
              <Input
                id="edit-subcategory"
                value={editingSubCategory?.name || ''}
                onChange={(e) => setEditingSubCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Enter subcategory name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSubCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubCategory} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 