-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to brands
CREATE POLICY "Allow public read access to brands"
ON brands FOR SELECT
TO public
USING (true);

-- Create policy to allow brand owners to manage their brands
CREATE POLICY "Allow brand owners to manage their brands"
ON brands FOR ALL
TO authenticated
USING (auth.uid() = user_id); 