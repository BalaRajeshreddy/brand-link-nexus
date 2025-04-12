
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BlockEditorMain } from '@/components/page-builder/block-renderers/BlockEditorMain';
import { Block, BlockType } from '@/types/block';
import { LoaderCircle } from 'lucide-react';

interface LandingPageData {
  id: string;
  title: string;
  backgroundColor: string;
  fontFamily: string;
}

export default function PublishedLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [pageData, setPageData] = useState<LandingPageData | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLandingPage() {
      try {
        setIsLoading(true);
        console.log('Fetching landing page with slug:', slug);
        
        // First, get the landing page data based on the slug
        const { data: pageData, error: pageError } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (pageError) {
          console.error('Landing page fetch error:', pageError);
          throw new Error('Landing page not found');
        }

        if (!pageData) {
          console.error('No landing page found with slug:', slug);
          throw new Error('No landing page found with this slug');
        }

        console.log('Found landing page:', pageData);
        
        // Format the page data
        const formattedPageData = {
          id: pageData.id,
          title: pageData.title,
          backgroundColor: pageData.background_color || '#FFFFFF',
          fontFamily: pageData.font_family || 'Inter, sans-serif'
        };
        
        setPageData(formattedPageData);
        
        // Now fetch the page components
        const { data: components, error: componentsError } = await supabase
          .from('page_components')
          .select('*')
          .eq('page_id', pageData.id)
          .order('position', { ascending: true });
        
        if (componentsError) {
          console.error('Components fetch error:', componentsError);
          throw new Error('Failed to load page components');
        }
        
        console.log('Found components:', components);
        
        if (components && components.length > 0) {
          const formattedBlocks = components.map(component => ({
            id: `block-${component.id}`,
            type: component.type as BlockType | string,
            content: component.content || {},
            styles: component.styles || {},
            order: component.position || 0,
            isActive: true,
            brandId: ''
          }));
          
          setBlocks(formattedBlocks);
        }
        
      } catch (error) {
        console.error("Error loading landing page:", error);
        setError(error instanceof Error ? error.message : 'Failed to load landing page');
        toast.error("Failed to load landing page");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchLandingPage();
    }
  }, [slug]);

  // Track page views for the QR code
  useEffect(() => {
    async function incrementQRViews() {
      if (!pageData?.id) return;
      
      try {
        // Find QR codes associated with this landing page
        const { data: qrData } = await supabase
          .from('qr_codes')
          .select('id')
          .eq('landing_page_id', pageData.id);
        
        if (qrData && qrData.length > 0) {
          // Increment view count for each associated QR code
          qrData.forEach(async (qr) => {
            await supabase.rpc('increment_qr_view', { qr_id: qr.id });
          });
          console.log('Incremented QR views for', qrData.length, 'QR codes');
        }
      } catch (error) {
        console.error('Error incrementing QR views:', error);
      }
    }
    
    incrementQRViews();
  }, [pageData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Page Not Found</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Page Not Found</h1>
        <p className="text-gray-600">The requested landing page does not exist.</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: pageData?.backgroundColor || '#FFFFFF',
        fontFamily: pageData?.fontFamily || 'Inter, sans-serif'
      }}
    >
      <div className="max-w-4xl mx-auto py-8 px-4">
        {blocks.length > 0 ? (
          <div className="space-y-8">
            {blocks.map((block) => (
              <BlockEditorMain
                key={block.id}
                blockType={block.type}
                content={block.content}
                styles={block.styles}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500">This page has no content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
