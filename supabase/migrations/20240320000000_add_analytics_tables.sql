-- Create QR code scan analytics table
CREATE TABLE qr_code_scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    qr_code_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT
);

-- Create landing page views analytics table
CREATE TABLE landing_page_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    source TEXT -- 'direct', 'qr_code', or 'other'
);

-- Add RLS policies
ALTER TABLE qr_code_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_views ENABLE ROW LEVEL SECURITY;

-- Policies for qr_code_scans
CREATE POLICY "Brands can view their own QR code scans"
    ON qr_code_scans FOR SELECT
    USING (brand_id IN (
        SELECT id FROM brands WHERE user_id = auth.uid()
    ));

-- Policies for landing_page_views
CREATE POLICY "Brands can view their own landing page views"
    ON landing_page_views FOR SELECT
    USING (brand_id IN (
        SELECT id FROM brands WHERE user_id = auth.uid()
    ));

CREATE POLICY "Allow anonymous inserts for landing page views"
    ON landing_page_views FOR INSERT
    WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_qr_code_scans_brand_id ON qr_code_scans(brand_id);
CREATE INDEX idx_qr_code_scans_qr_code_id ON qr_code_scans(qr_code_id);
CREATE INDEX idx_landing_page_views_brand_id ON landing_page_views(brand_id);
CREATE INDEX idx_landing_page_views_landing_page_id ON landing_page_views(landing_page_id); 