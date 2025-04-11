-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE role_type AS ENUM ('ADMIN', 'BRAND', 'CUSTOMER');
CREATE TYPE file_type AS ENUM ('IMAGE', 'PDF', 'VIDEO');

-- Create tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role role_type DEFAULT 'CUSTOMER',
    first_name TEXT,
    last_name TEXT,
    age INTEGER,
    gender TEXT,
    phone TEXT,
    avatar TEXT
);

CREATE TABLE customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    preferences JSONB,
    saved_brands UUID[]
);

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo TEXT,
    tagline TEXT,
    description TEXT,
    video_url TEXT,
    mission TEXT,
    vision TEXT,
    founding_year INTEGER,
    email TEXT NOT NULL,
    phone TEXT,
    address JSONB,
    social_links JSONB,
    certifications JSONB,
    awards JSONB,
    press_features JSONB,
    featured_products JSONB,
    new_launch_products JSONB,
    campaigns JSONB,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    settings JSONB
);

CREATE TABLE admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    permissions TEXT[],
    department TEXT,
    is_super_admin BOOLEAN DEFAULT false
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    comment TEXT,
    images TEXT[]
);

CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type file_type NOT NULL,
    size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    metadata JSONB,
    folder TEXT,
    tags TEXT[],
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_brand_id ON reviews(brand_id);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_brand_id ON files(brand_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users table policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Customer profiles policies
CREATE POLICY "Customers can view their own profile"
    ON customer_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Customers can update their own profile"
    ON customer_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Brands policies
CREATE POLICY "Brands can view their own profile"
    ON brands FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Brands can update their own profile"
    ON brands FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active brands"
    ON brands FOR SELECT
    USING (is_active = true);

-- Admin profiles policies
CREATE POLICY "Admins can view their own profile"
    ON admin_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can update their own profile"
    ON admin_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Users can view reviews"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Files policies
CREATE POLICY "Users can view their own files"
    ON files FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can upload files"
    ON files FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files"
    ON files FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
    ON files FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at
    BEFORE UPDATE ON customer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at
    BEFORE UPDATE ON admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at
    BEFORE UPDATE ON files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 