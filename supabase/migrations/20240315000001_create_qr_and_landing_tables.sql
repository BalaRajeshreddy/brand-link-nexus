-- Create landing_pages table
CREATE TABLE IF NOT EXISTS landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    settings JSONB,
    CONSTRAINT landing_pages_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    scan_count INTEGER DEFAULT 0,
    settings JSONB,
    CONSTRAINT qr_codes_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
    CONSTRAINT qr_codes_landing_page_id_fkey FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_landing_pages_brand_id ON landing_pages(brand_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_qr_codes_brand_id ON qr_codes(brand_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_landing_page_id ON qr_codes(landing_page_id);

-- Enable RLS
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for landing_pages
CREATE POLICY "Enable read access for all users" ON landing_pages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON landing_pages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON landing_pages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON landing_pages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for qr_codes
CREATE POLICY "Enable read access for all users" ON qr_codes
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON qr_codes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON qr_codes
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON qr_codes
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create triggers for updated_at
CREATE TRIGGER update_landing_pages_updated_at
    BEFORE UPDATE ON landing_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at
    BEFORE UPDATE ON qr_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 