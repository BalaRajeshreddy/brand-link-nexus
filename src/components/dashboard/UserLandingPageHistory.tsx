import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { QrCode, Link } from 'lucide-react';

interface Visit {
  id: string;
  visited_at: string;
  visit_source: 'QR_CODE' | 'DIRECT_LINK';
  brand: {
    name: string;
    logo: string;
  };
  landing_page: {
    title: string;
    url: string;
  };
}

export function UserLandingPageHistory() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('user_landing_page_visits')
        .select(`
          id,
          visited_at,
          visit_source,
          brand:brands (
            name,
            logo
          ),
          landing_page:landing_pages (
            title,
            url
          )
        `)
        .order('visited_at', { ascending: false });

      if (error) throw error;
      const transformedData: Visit[] = (data || []).map(visit => ({
        id: visit.id,
        visited_at: visit.visited_at,
        visit_source: visit.visit_source,
        brand: visit.brand[0],
        landing_page: visit.landing_page[0]
      }));
      setVisits(transformedData);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (visits.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">No Landing Page Visits Yet</h3>
          <p className="text-gray-600">
            Your landing page visit history will appear here once you start visiting pages.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Landing Page History</h2>
      <div className="grid gap-4">
        {visits.map((visit) => (
          <Card key={visit.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {visit.brand.logo ? (
                  <img 
                    src={visit.brand.logo} 
                    alt={visit.brand.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {visit.brand.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{visit.brand.name}</h3>
                  <p className="text-sm text-gray-600">{visit.landing_page.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {visit.visit_source === 'QR_CODE' ? (
                      <QrCode className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Link className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {format(new Date(visit.visited_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(visit.landing_page.url, '_blank')}
              >
                Visit Again
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 