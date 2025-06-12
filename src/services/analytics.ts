import { supabase } from '@/integrations/supabase/client';

export const trackQRCodeScan = async (
  qrCodeId: string,
  brandId: string,
  landingPageId?: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('qr_scans').upsert({
      qr_id: qrCodeId,
      brand_id: brandId,
      landing_page_id: landingPageId,
      user_id: user?.id || null,
      ip: null,
      city: null,
      country: null,
      user_agent: navigator.userAgent
    }, { onConflict: 'qr_id,user_id' });
  } catch (error) {
    console.error('Error tracking QR code scan:', error);
  }
};

export const trackLandingPageView = async (
  landingPageId: string,
  brandId: string,
  source: 'direct' | 'qr_code' | 'other'
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('landing_page_views').upsert({
      landing_page_id: landingPageId,
      brand_id: brandId,
      user_id: user?.id || null,
      source,
      ip: null,
      city: null,
      country: null,
      user_agent: navigator.userAgent
    }, { onConflict: 'landing_page_id,user_id' });
  } catch (error) {
    console.error('Error tracking landing page view:', error);
  }
}; 