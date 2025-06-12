import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '@/integrations/supabase/client';
import { trackQRCodeScan, trackLandingPageView } from '@/services/analytics';
import { toast } from '@/components/ui/use-toast';

export const QRCodeScanner = () => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const handleScan = async (decodedText: string) => {
      try {
        // Extract QR code ID from the URL
        const qrCodeId = decodedText.split('/').pop();
        
        // Get QR code details
        const { data: qrCode, error } = await supabase
          .from('qr_codes')
          .select('*, brand:brand_id(*), landing_page:landing_page_id(*)')
          .eq('id', qrCodeId)
          .single();

        if (error) throw error;

        if (qrCode) {
          // Track QR code scan
          await trackQRCodeScan(qrCode.id, qrCode.brand_id);

          // If QR code links to a landing page, track the landing page view
          if (qrCode.landing_page_id) {
            await trackLandingPageView(qrCode.landing_page_id, qrCode.brand_id, 'qr_code');
            window.location.href = `/${qrCode.landing_page.slug}`;
          } else {
            // If it's a direct URL, just redirect
            window.location.href = qrCode.url;
          }
        }
      } catch (error) {
        console.error('Error processing QR code:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process QR code"
        });
      }
    };

    // Initialize scanner
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(handleScan, (error) => {
      console.error('QR Scanner error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to access camera"
      });
    });

    // Cleanup
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="qr-reader" className="w-full"></div>
    </div>
  );
}; 