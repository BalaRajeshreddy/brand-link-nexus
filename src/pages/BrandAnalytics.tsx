import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { QrCode, Mail, Eye, MousePointerClick, BarChart2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BrandAnalytics = () => {
  const [userName, setUserName] = useState("...");
  const [isLoading, setIsLoading] = useState(true);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>({
    totalViews: 0,
    totalQRScans: 0,
    totalClicks: 0,
    totalSubmissions: 0,
    registeredViews: 0,
    unregisteredViews: 0,
    registeredScans: 0,
    unregisteredScans: 0,
    perPage: [],
    landingPages: [],
    recentClicks: [],
    qrCodes: []
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalEvents, setModalEvents] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    async function fetchBrandAndAnalytics() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "Brand User");
      // Get brand id
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (brand && brand.id) {
        setBrandId(brand.id);
        // Fetch landing pages for this brand
        const { data: landingPages } = await supabase
          .from('landing_pages')
          .select('id, title, slug')
          .eq('brand_id', brand.id);
        // Fetch QR codes for this brand with landing page info
        const { data: qrCodesRaw } = await supabase
          .from('qr_codes')
          .select('id, title, url, landing_page_id')
          .eq('brand_id', brand.id);
        // Fetch scan counts for each QR code
        let qrCodes = [];
        if (qrCodesRaw && qrCodesRaw.length > 0) {
          const qrIds = qrCodesRaw.map(qr => qr.id);
          const { data: scanCounts } = await supabase
            .from('qr_scans')
            .select('qr_code_id, count:id')
            .in('qr_code_id', qrIds);
          qrCodes = qrCodesRaw.map(qr => {
            const scanCount = scanCounts?.find(s => s.qr_code_id === qr.id)?.count || 0;
            const landingPage = landingPages?.find(lp => lp.id === qr.landing_page_id);
            return {
              ...qr,
              scanCount,
              landing_page_title: landingPage?.title || '',
              landing_page_slug: landingPage?.slug || ''
            };
          });
        }
        // Fetch analytics
        const [
          { count: totalViews },
          { count: totalQRScans },
          { count: totalClicks },
          { count: totalSubmissions },
          { count: registeredViews },
          { count: unregisteredViews },
          { count: registeredScans },
          { count: unregisteredScans }
        ] = await Promise.all([
          supabase.from('landing_page_views').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id),
          supabase.from('qr_scans').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id),
          supabase.from('page_clicks').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id),
          supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id),
          supabase.from('landing_page_views').select('user_id', { count: 'exact', head: true }).eq('brand_id', brand.id).eq('is_registered', true),
          supabase.from('landing_page_views').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id).eq('is_registered', false),
          supabase.from('qr_scans').select('user_id', { count: 'exact', head: true }).eq('brand_id', brand.id).eq('is_registered', true),
          supabase.from('qr_scans').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id).eq('is_registered', false),
        ]);
        // Per-landing-page breakdown
        const [viewsData, qrScansData, clicksData, submissionsData] = await Promise.all([
          supabase.from('landing_page_views').select('landing_page_id, is_registered').eq('brand_id', brand.id),
          supabase.from('qr_scans').select('landing_page_id, is_registered').eq('brand_id', brand.id),
          supabase.from('page_clicks').select('landing_page_id').eq('brand_id', brand.id),
          supabase.from('contact_submissions').select('landing_page_id').eq('brand_id', brand.id),
        ]);
        function countByPage(arr, key = 'landing_page_id', filter = null) {
          const map = {};
          arr?.data?.forEach(row => {
            if (!row[key]) return;
            if (filter && !filter(row)) return;
            map[row[key]] = (map[row[key]] || 0) + 1;
          });
          return map;
        }
        const viewsByPage = countByPage(viewsData);
        const qrScansByPage = countByPage(qrScansData);
        const clicksByPage = countByPage(clicksData);
        const submissionsByPage = countByPage(submissionsData);
        // Registered/unregistered breakdown per page
        const registeredViewsByPage = countByPage(viewsData, 'landing_page_id', row => row.is_registered);
        const unregisteredViewsByPage = countByPage(viewsData, 'landing_page_id', row => !row.is_registered);
        const registeredScansByPage = countByPage(qrScansData, 'landing_page_id', row => row.is_registered);
        const unregisteredScansByPage = countByPage(qrScansData, 'landing_page_id', row => !row.is_registered);
        setAnalytics({
          totalViews: totalViews || 0,
          totalQRScans: totalQRScans || 0,
          totalClicks: totalClicks || 0,
          totalSubmissions: totalSubmissions || 0,
          registeredViews: registeredViews || 0,
          unregisteredViews: unregisteredViews || 0,
          registeredScans: registeredScans || 0,
          unregisteredScans: unregisteredScans || 0,
          perPage: landingPages?.map(page => ({
            id: page.id,
            title: page.title,
            views: viewsByPage[page.id] || 0,
            qrScans: qrScansByPage[page.id] || 0,
            clicks: clicksByPage[page.id] || 0,
            submissions: submissionsByPage[page.id] || 0,
            registeredViews: registeredViewsByPage[page.id] || 0,
            unregisteredViews: unregisteredViewsByPage[page.id] || 0,
            registeredScans: registeredScansByPage[page.id] || 0,
            unregisteredScans: unregisteredScansByPage[page.id] || 0,
          })) || [],
          landingPages: landingPages || [],
          recentClicks: [],
          qrCodes,
        });
      }
      setIsLoading(false);
    }
    fetchBrandAndAnalytics();
  }, []);

  // Helper to open modal and fetch events
  const openEventModal = async ({ type, id, name }) => {
    setModalOpen(true);
    setModalTitle(`${type === 'qr_scans' ? 'QR Scans' : 'Page Views'} for ${name}`);
    setModalLoading(true);
    let events = [];
    if (type === 'qr_scans') {
      const { data } = await supabase
        .from('qr_scans')
        .select('id, created_at, city, country')
        .eq('qr_code_id', id)
        .order('created_at', { ascending: false });
      events = data || [];
    } else if (type === 'page_views') {
      const { data } = await supabase
        .from('page_views')
        .select('id, created_at, city, country')
        .eq('landing_page_id', id)
        .order('created_at', { ascending: false });
      events = data || [];
    }
    setModalEvents(events);
    setModalLoading(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="Brand" userName="...">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="Brand" userName={userName}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <StatsCard 
              title="Total Page Views" 
              value={analytics.totalViews}
              icon={<Eye className="h-5 w-5 text-primary-blue" />} 
            />
            <div className="text-xs text-muted-foreground mt-1">
              Registered: {analytics.registeredViews || 0} | Unregistered: {analytics.unregisteredViews || 0}
            </div>
          </div>
          <div>
            <StatsCard 
              title="QR Scans" 
              value={analytics.totalQRScans}
              icon={<QrCode className="h-5 w-5 text-primary-green" />} 
            />
            <div className="text-xs text-muted-foreground mt-1">
              Registered: {analytics.registeredScans || 0} | Unregistered: {analytics.unregisteredScans || 0}
            </div>
          </div>
          <StatsCard 
            title="Page Clicks" 
            value={analytics.totalClicks}
            icon={<MousePointerClick className="h-5 w-5 text-primary-orange" />} 
          />
          <StatsCard 
            title="Form Submissions" 
            value={analytics.totalSubmissions}
            icon={<Mail className="h-5 w-5 text-primary-indigo" />} 
          />
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">QR Codes Analytics</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-t">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2">QR Code</th>
                  <th className="text-left p-2">Landing Page</th>
                  <th className="text-left p-2">QR Scans</th>
                  <th className="text-left p-2">QR URL</th>
                </tr>
              </thead>
              <tbody>
                {analytics.qrCodes?.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No QR codes found.</td></tr>
                ) : analytics.qrCodes.map(qr => (
                  <tr key={qr.id}>
                    <td className="p-2 font-medium">{qr.title}</td>
                    <td className="p-2">{qr.landing_page_title ? `${qr.landing_page_title} (${qr.landing_page_slug})` : '-'}</td>
                    <td className="p-2">{qr.scanCount}</td>
                    <td className="p-2"><a href={qr.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Open</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Landing Page Analytics</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-t">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2">Landing Page</th>
                  <th className="text-left p-2">Views</th>
                  <th className="text-left p-2">QR Scans</th>
                  <th className="text-left p-2">Clicks</th>
                  <th className="text-left p-2">Submissions</th>
                  <th className="text-left p-2">Reg Views</th>
                  <th className="text-left p-2">Unreg Views</th>
                  <th className="text-left p-2">Reg Scans</th>
                  <th className="text-left p-2">Unreg Scans</th>
                </tr>
              </thead>
              <tbody>
                {analytics.perPage.map(page => (
                  <tr key={page.id}>
                    <td className="p-2">{page.title}</td>
                    <td className="p-2">
                      <button className="text-primary underline" onClick={() => openEventModal({ type: 'page_views', id: page.id, name: page.title })}>
                        {page.views}
                      </button>
                    </td>
                    <td className="p-2">{page.qrScans}</td>
                    <td className="p-2">{page.clicks}</td>
                    <td className="p-2">{page.submissions}</td>
                    <td className="p-2">{page.registeredViews}</td>
                    <td className="p-2">{page.unregisteredViews}</td>
                    <td className="p-2">{page.registeredScans}</td>
                    <td className="p-2">{page.unregisteredScans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Recent Clicks Table */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Recent Customer Clicks</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-t">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2">Button Text</th>
                  <th className="text-left p-2">Link</th>
                  <th className="text-left p-2">Customer Email</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentClicks.map(click => (
                  <tr key={click.id}>
                    <td className="p-2">{click.button_text}</td>
                    <td className="p-2">
                      <a href={click.link_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {click.link_url}
                      </a>
                    </td>
                    <td className="p-2">{click.customer_email || <span className="text-muted-foreground">Anonymous</span>}</td>
                    <td className="p-2">{new Date(click.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal for event list */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{modalTitle}</DialogTitle>
            </DialogHeader>
            {modalLoading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : modalEvents.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No events found.</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full text-sm border-t">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">City</th>
                      <th className="text-left p-2">Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalEvents.map(ev => (
                      <tr key={ev.id}>
                        <td className="p-2">{new Date(ev.created_at).toLocaleString()}</td>
                        <td className="p-2">{ev.city || '-'}</td>
                        <td className="p-2">{ev.country || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default BrandAnalytics; 