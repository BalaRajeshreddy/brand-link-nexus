-- Update products table to use proper foreign key references
ALTER TABLE products
    DROP COLUMN category,
    DROP COLUMN subcategory,
    ADD COLUMN category_id UUID REFERENCES product_categories(id),
    ADD COLUMN subcategory_id UUID REFERENCES product_subcategories(id);

-- Create indexes for the new foreign key columns
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_subcategory_id ON products(subcategory_id);

-- Add RLS policies for the new columns
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON products
    FOR DELETE USING (auth.role() = 'authenticated'); 