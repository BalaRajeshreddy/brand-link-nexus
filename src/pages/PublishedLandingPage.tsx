import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Block, BlockType } from '@/types/block';
import { BlockEditorMain } from '@/components/page-builder/block-renderers/BlockEditorMain';
import { toast } from "sonner";
import { LandingPageWrapper } from '@/components/landing/LandingPageWrapper';
import { trackLandingPageView } from '@/services/analytics';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

declare global {
  interface Window {
    BRAND_ID?: string;
    LANDING_PAGE_ID?: string;
  }
}

interface LandingPageData {
  id: string;
  title: string;
  slug: string;
  background_color: string;
  font_family: string;
  published: boolean;
  brand_id?: string;
  brandId?: string;
}

const PublishedLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageData, setPageData] = useState<LandingPageData | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const analyticsRecorded = useRef(false);
  const [searchParams] = useSearchParams();
  const qrId = searchParams.get('qr_id');

  // Save brand logic
  const [isBrandSaved, setIsBrandSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [brandInfo, setBrandInfo] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch current user
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [brandOwnerId, setBrandOwnerId] = useState<string | null>(null);

  console.log('[PublishedLandingPage] Component mounted with:', { slug, qrId });

  useEffect(() => {
    console.log('[PublishedLandingPage] Starting page load');
    const fetchPageContent = async () => {
      console.log('Fetching page with slug:', slug, 'and qr_id:', qrId);
      setIsLoading(true);
      setError(null);

      try {
        let pageData = null;
        // If qr_id is present, fetch landing page via QR code
        if (qrId) {
          const { data: qrData, error: qrError } = await supabase
            .from('qr_codes')
            .select('landing_page_id')
            .eq('id', qrId)
            .single();
          if (qrError || !qrData) {
            setError('Invalid QR code or landing page not found');
            setIsLoading(false);
            return;
          }
          const { data: page, error: pageError } = await supabase
            .from('landing_pages')
            .select('*')
            .eq('id', qrData.landing_page_id)
            .single();
          if (pageError || !page) {
            setError('Landing page not found');
            setIsLoading(false);
            return;
          }
          pageData = page;
        } else if (slug) {
          // Otherwise, fetch by slug
          const { data: page, error: pageError } = await supabase
            .from('landing_pages')
            .select('*')
            .eq('slug', slug)
            .single();
          if (pageError || !page) {
            setError(`Page not found: ${slug}`);
            setIsLoading(false);
            return;
          }
          pageData = page;
        } else {
          setError('Invalid page URL');
          setIsLoading(false);
          return;
        }

        setPageData(pageData);
        window.BRAND_ID = pageData.brand_id || pageData.brandId;
        window.LANDING_PAGE_ID = pageData.id;

        // Then get all components for this page
        const { data: components, error: componentsError } = await supabase
          .from('page_components')
          .select('*')
          .eq('page_id', pageData.id)
          .order('position', { ascending: true });

        if (componentsError) {
          console.error('Error fetching page components:', componentsError);
          toast.error('Failed to load page components');
          setError('Failed to load page content');
          setIsLoading(false);
          return;
        }

        if (components && components.length > 0) {
          const loadedBlocks = components.map(component => ({
            id: `block-${component.id}`,
            type: component.type as BlockType | string,
            content: component.content || {},
            styles: component.styles || {}
          }));
          setBlocks(loadedBlocks);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageContent();
  }, [slug, qrId]);

  useEffect(() => {
    // Fetch brand info and saved state if pageData is loaded
    const fetchBrandAndSaved = async () => {
      if (!pageData?.brand_id) {
        console.log('[PublishedLandingPage] No brand_id in pageData:', pageData);
        return;
      }
      console.log('[PublishedLandingPage] Fetching brand info for brand_id:', pageData.brand_id);
      
      try {
        // Fetch brand info
        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id, name, logo, description, user_id')
          .eq('id', pageData.brand_id)
          .single();
        
        if (brandError) {
          console.error('[PublishedLandingPage] Error fetching brand:', brandError);
          return;
        }
        
        console.log('[PublishedLandingPage] Brand info fetched:', brand);
        setBrandInfo(brand);
        setBrandOwnerId(brand.user_id);

        // Fetch saved brands for user if logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('customer_profiles')
            .select('saved_brands')
            .eq('user_id', user.id)
            .single();
          if (profile?.saved_brands && Array.isArray(profile.saved_brands)) {
            setIsBrandSaved(profile.saved_brands.includes(pageData.brand_id));
          }
        }
      } catch (err) {
        console.error('[PublishedLandingPage] Error in fetchBrandAndSaved:', err);
      }
    };
    if (pageData?.brand_id) fetchBrandAndSaved();
  }, [pageData?.brand_id]);

  // Fetch current user
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    })();
  }, []);

  const handleSaveBrand = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setSaveLoading(true);
    try {
      // First check if customer profile exists
      const { data: profile, error: fetchError } = await supabase
        .from('customer_profiles')
        .select('saved_brands')
        .eq('user_id', user.id)
        .single();

      let savedBrands = [];
      
      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: createError } = await supabase
            .from('customer_profiles')
            .insert({
              user_id: user.id,
              saved_brands: [pageData.brand_id],
              email: user.email
            });
          
          if (createError) throw createError;
          savedBrands = [pageData.brand_id];
        } else {
          throw fetchError;
        }
      } else {
        // Profile exists, update saved brands
        savedBrands = profile?.saved_brands || [];
        if (savedBrands.includes(pageData.brand_id)) {
          savedBrands = savedBrands.filter((id: string) => id !== pageData.brand_id);
        } else {
          savedBrands = [...savedBrands, pageData.brand_id];
        }

        const { error: updateError } = await supabase
          .from('customer_profiles')
          .update({ saved_brands: savedBrands })
          .eq('user_id', user.id);
        
        if (updateError) throw updateError;
      }

      setIsBrandSaved(!isBrandSaved);
      toast.success(!isBrandSaved ? 'Brand saved!' : 'Brand removed from saved');
    } catch (err) {
      console.error('Error saving brand:', err);
      toast.error('Failed to update saved brands');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSignUp = () => {
    setShowAuthDialog(false);
    navigate('/auth/register');
  };

  const handleLogin = () => {
    setShowAuthDialog(false);
    navigate('/auth/login');
  };

  // Add a new effect to track landing page view only once
  useEffect(() => {
    if (
      pageData &&
      (pageData.brand_id || pageData.brandId) &&
      !analyticsRecorded.current
    ) {
      analyticsRecorded.current = true;
      trackLandingPageView(
        pageData.id,
        pageData.brand_id || pageData.brandId,
        'direct'
      ).catch((err) => {
        console.error('Failed to record landing page view:', err);
      });
    }
  }, [pageData]);

  console.log('[PublishedLandingPage] Current state:', { isLoading, error, hasPageData: !!pageData });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <a href="/" className="text-primary hover:underline">
          Go to Homepage
        </a>
      </div>
    );
  }

  console.log('[PublishedLandingPage] Rendering page content');
  return (
    <LandingPageWrapper>
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: pageData?.background_color || '#FFFFFF',
          fontFamily: pageData?.font_family || 'Inter, sans-serif'
        }}
      >
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Brand info and save icon - show for all users except brand owner */}
          {brandInfo && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {brandInfo.logo && (
                  <img src={brandInfo.logo} alt={brandInfo.name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <div>
                  <h1 className="text-2xl font-bold">{pageData?.title}</h1>
                  <div className="text-gray-500 text-sm">{brandInfo.name}</div>
                </div>
              </div>
              {(!currentUserId || currentUserId !== brandInfo.user_id) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveBrand}
                  disabled={saveLoading}
                  className="transition-colors duration-200"
                  aria-label={isBrandSaved ? 'Unsave brand' : 'Save brand'}
                >
                  {isBrandSaved ? (
                    <Heart className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartOff className="h-6 w-6" />
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Auth dialog for non-logged-in users */}
          <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign in to save brands</DialogTitle>
                <DialogDescription>
                  Please sign in or create an account to save your favorite brands.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={handleLogin}>Login</Button>
                <Button variant="outline" onClick={handleSignUp}>Sign Up</Button>
                <Button variant="ghost" onClick={() => setShowAuthDialog(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Page content */}
          {blocks.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700">This page has no content</h2>
            </div>
          ) : (
            <div className="space-y-6">
              {blocks.map((block) => (
                <div key={block.id} className="bg-white rounded-lg shadow p-4">
                  <BlockEditorMain
                    blockType={block.type as BlockType | string}
                    content={
                      block.type === 'contact form'
                        ? { ...block.content, brandId: pageData?.brand_id || pageData?.brandId }
                        : block.content
                    }
                    styles={block.styles}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LandingPageWrapper>
  );
};

export default PublishedLandingPage;
