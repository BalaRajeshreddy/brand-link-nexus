import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';

interface LandingPageWrapperProps {
  children: React.ReactNode;
}

export function LandingPageWrapper({ children }: LandingPageWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkipPrompt, setShowSkipPrompt] = useState(false);
  const [skipUntil, setSkipUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { slug } = useParams<{ slug: string }>();
  const qrId = searchParams.get('qr_id');

  console.log('[LandingPageWrapper] Initialized with:', {
    slug,
    qrId,
    currentPath: window.location.pathname,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  const checkAuth = useCallback(async () => {
    try {
      // First check localStorage for session
      const storedSession = localStorage.getItem('sb-cbjbnfcmzkkubkklqqlc-auth-token');
      console.log('[LandingPageWrapper] Stored session:', storedSession);

      if (!storedSession) {
        console.log('[LandingPageWrapper] No stored session found');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Parse the stored session
      const parsedSession = JSON.parse(storedSession);
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (parsedSession?.expires_at && parsedSession.expires_at > currentTime) {
        console.log('[LandingPageWrapper] Valid stored session found');
        setIsAuthenticated(true);
        if (parsedSession.user?.id) {
          await recordVisit(parsedSession.user.id);
        }
        setIsLoading(false);
        return;
      }

      // If stored session is invalid, check with Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[LandingPageWrapper] Error getting session:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      console.log('[LandingPageWrapper] Session check result:', {
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
        currentTime: new Date().toISOString(),
        isExpired: session?.expires_at ? session.expires_at * 1000 < Date.now() : true
      });

      if (session && session.user && session.expires_at && session.expires_at * 1000 > Date.now()) {
        console.log('[LandingPageWrapper] Valid session found, setting authenticated to true');
        setIsAuthenticated(true);
        await recordVisit(session.user.id);
      } else {
        console.log('[LandingPageWrapper] No valid session found, setting authenticated to false');
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('[LandingPageWrapper] Error in checkAuth:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [qrId, slug]);

  useEffect(() => {
    console.log('[LandingPageWrapper] useEffect triggered');
    
    // Initial auth check
    checkAuth();

    // Set up periodic session check
    const intervalId = setInterval(checkAuth, 2000); // Check every 2 seconds

    // Listen for storage events (session changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sb-cbjbnfcmzkkubkklqqlc-auth-token') {
        console.log('[LandingPageWrapper] Storage event detected:', e);
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[LandingPageWrapper] Auth state changed:', { 
        event, 
        hasSession: !!session,
        sessionDetails: session ? {
          user: session.user?.id,
          expiresAt: session.expires_at,
          accessToken: !!session.access_token
        } : null
      });

      // Only update state for relevant events
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [checkAuth]);

  // Handle skip logic and timer
  useEffect(() => {
    // On mount, check if skipUntil is in localStorage
    const stored = localStorage.getItem('skip-auth-popup-until');
    if (stored) {
      const until = parseInt(stored, 10);
      if (until > Date.now()) {
        setShowPopup(false);
        setSkipUntil(until);
        setCountdown(Math.ceil((until - Date.now()) / 1000));
      }
    }
  }, []);

  useEffect(() => {
    if (!skipUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((skipUntil - Date.now()) / 1000);
      setCountdown(remaining);
      if (remaining <= 0) {
        setShowPopup(true);
        setSkipUntil(null);
        localStorage.removeItem('skip-auth-popup-until');
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [skipUntil]);

  const handleSkip = () => {
    const until = Date.now() + 2 * 60 * 1000; // 2 minutes
    setShowPopup(false);
    setSkipUntil(until);
    setCountdown(120);
    localStorage.setItem('skip-auth-popup-until', until.toString());
  };

  const recordVisit = async (userId: string) => {
    console.log('[LandingPageWrapper] recordVisit called with userId:', userId);
    try {
      let landingPageId: string | null = null;
      let brandId: string | null = null;

      if (qrId) {
        console.log('[LandingPageWrapper] Recording visit from QR code:', qrId);
        const { data: qrData, error: qrError } = await supabase
          .from('qr_codes')
          .select('landing_page_id, brand_id')
          .eq('id', qrId)
          .single();

        if (qrError) {
          console.error('[LandingPageWrapper] Error fetching QR code data:', qrError);
          throw qrError;
        }
        console.log('[LandingPageWrapper] QR code data:', qrData);
        landingPageId = qrData.landing_page_id;
        brandId = qrData.brand_id;
      } else if (slug) {
        console.log('[LandingPageWrapper] Recording direct visit for slug:', slug);
        const { data: pageData, error: pageError } = await supabase
          .from('landing_pages')
          .select('id, brand_id')
          .eq('slug', slug)
          .single();

        if (pageError) {
          console.error('[LandingPageWrapper] Error fetching landing page data:', pageError);
          throw pageError;
        }
        console.log('[LandingPageWrapper] Landing page data:', pageData);
        landingPageId = pageData.id;
        brandId = pageData.brand_id;
      }

      if (landingPageId && brandId) {
        console.log('[LandingPageWrapper] Recording visit with:', {
          userId,
          brandId,
          landingPageId,
          source: qrId ? 'QR_CODE' : 'DIRECT'
        });
        
        const { error: visitError } = await supabase
          .from('user_landing_page_visits')
          .insert({
            user_id: userId,
            brand_id: brandId,
            landing_page_id: landingPageId,
            visit_source: qrId ? 'QR_CODE' : 'DIRECT',
            ip_address: '', // You can add IP tracking if needed
            user_agent: navigator.userAgent
          });

        if (visitError) {
          console.error('[LandingPageWrapper] Error recording visit:', visitError);
        } else {
          console.log('[LandingPageWrapper] Visit recorded successfully');
        }
      } else {
        console.log('[LandingPageWrapper] Missing required data for visit recording:', { landingPageId, brandId });
      }
    } catch (error) {
      console.error('[LandingPageWrapper] Error in recordVisit:', error);
    }
  };

  if (isLoading) {
    console.log('[LandingPageWrapper] Rendering loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show popup unless user has skipped and timer is running
    if (!showPopup) {
      // Show countdown timer in top right
      return (
        <>
          <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
            <span className="bg-gray-900 text-white px-4 py-2 rounded shadow">
              Login popup will return in: {countdown}s
            </span>
          </div>
          {children}
        </>
      );
    }
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center">Welcome!</h2>
            <p className="text-center text-gray-600">
              Please login or register to view this landing page and track your visits.
            </p>
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => navigate('/auth/login')}
              >
                Login
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/auth/register')}
              >
                Register
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-gray-500"
                onClick={() => setShowSkipPrompt(true)}
              >
                Skip for now
              </Button>
            </div>
          </Card>
        </div>

        <AlertDialog open={showSkipPrompt} onOpenChange={setShowSkipPrompt}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Skip Login?</AlertDialogTitle>
              <AlertDialogDescription>
                If you login or register now, you'll get:
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>Points for viewing this page</li>
                  <li>Track your visit history</li>
                  <li>Access to exclusive content</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowSkipPrompt(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleSkip}>
                Continue without login
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  console.log('[LandingPageWrapper] Rendering children for authenticated user');
  return <>{children}</>;
} 