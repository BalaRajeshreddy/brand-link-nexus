import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { trackLandingPageView } from '@/services/analytics';

const LandingPage = () => {
  const { slug } = useParams();
  const [landingPage, setLandingPage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('*, brand:brand_id(*)')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        if (data) {
          setLandingPage(data);
          // Track landing page view
          await trackLandingPageView(data.id, data.brand_id, 'direct');
        }
      } catch (error) {
        console.error('Error fetching landing page:', error);
        setError('Landing page not found');
      }
    };

    if (slug) fetchLandingPage();
  }, [slug]);

  if (error) return <div>{error}</div>;
  if (!landingPage) return <div>Loading...</div>;

  return (
    <div>
      <h1>{landingPage.title}</h1>
      {/* Add your landing page content here */}
    </div>
  );
};

export default LandingPage; 