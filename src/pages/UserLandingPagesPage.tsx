import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

const UserLandingPagesPage = () => {
  const [landingPages, setLandingPages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [filters, setFilters] = useState({
    brand: '',
    industry: '',
    dateFrom: '',
    dateTo: '',
    sort: 'desc',
    search: '',
  });

  useEffect(() => {
    // Fetch brands for filter dropdown
    supabase.from('brands').select('id, name, industry_category').then(({ data }) => {
      setBrands(data || []);
      setIndustryOptions(Array.from(new Set((data || []).map(b => b.industry_category).filter(Boolean))));
    });
  }, []);

  useEffect(() => {
    // Fetch landing pages with filters
    let query = supabase
      .from('landing_pages')
      .select('id, title, slug, created_at, published, brand:brands(id, name, industry_category, logo)')
      .order('created_at', { ascending: filters.sort === 'asc' });
    if (filters.brand) query = query.eq('brand_id', filters.brand);
    if (filters.industry) query = query.eq('brands.industry_category', filters.industry);
    if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom);
    if (filters.dateTo) query = query.lte('created_at', filters.dateTo);
    if (filters.search) query = query.ilike('title', `%${filters.search}%`);
    query.then(({ data }) => setLandingPages(data || []));
  }, [filters]);

  return (
    <DashboardLayout userType="User" userName={"..."}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Browse Landing Pages</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Search landing pages..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-64"
          />
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
            className="w-40"
          />
          <Input
            type="date"
            value={filters.dateTo}
            onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
            className="w-40"
          />
          <Select value={filters.sort} onValueChange={v => setFilters(f => ({ ...f, sort: v }))}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Sort by date" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map(page => (
            <div key={page.id} className="border rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {page.brand?.logo && <img src={page.brand.logo} alt={page.brand.name} className="w-8 h-8 rounded-full" />}
                <div>
                  <div className="font-semibold">{page.title}</div>
                  <div className="text-xs text-muted-foreground">{page.brand?.name || 'Unknown Brand'} ({page.brand?.industry_category || 'N/A'})</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Created: {page.created_at?.slice(0, 10)}</div>
              <div className="text-xs text-muted-foreground">Published: {page.published ? 'Yes' : 'No'}</div>
              <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">Open Landing Page</a>
            </div>
          ))}
          {landingPages.length === 0 && <div className="col-span-full text-center text-muted-foreground">No landing pages found.</div>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserLandingPagesPage; 