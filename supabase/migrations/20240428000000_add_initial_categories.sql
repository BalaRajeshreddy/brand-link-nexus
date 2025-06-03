-- Add initial product categories
INSERT INTO product_categories (name) VALUES
    ('Food & Beverages'),
    ('Beauty & Personal Care'),
    ('Home & Kitchen'),
    ('Health & Wellness'),
    ('Fashion & Apparel'),
    ('Electronics'),
    ('Sports & Fitness'),
    ('Toys & Games'),
    ('Books & Stationery'),
    ('Pet Supplies')
ON CONFLICT (name) DO NOTHING;

-- Add initial subcategories for Food & Beverages
INSERT INTO product_subcategories (name, category_id)
SELECT 
    subcategory,
    pc.id
FROM 
    product_categories pc,
    (VALUES 
        ('Snacks & Chips'),
        ('Beverages'),
        ('Bakery'),
        ('Dairy Products'),
        ('Organic Foods'),
        ('Spices & Condiments')
    ) AS subcategories(subcategory)
WHERE 
    pc.name = 'Food & Beverages'
ON CONFLICT (name, category_id) DO NOTHING;

-- Add initial subcategories for Beauty & Personal Care
INSERT INTO product_subcategories (name, category_id)
SELECT 
    subcategory,
    pc.id
FROM 
    product_categories pc,
    (VALUES 
        ('Skincare'),
        ('Haircare'),
        ('Makeup'),
        ('Fragrances'),
        ('Bath & Body'),
        ('Natural & Organic')
    ) AS subcategories(subcategory)
WHERE 
    pc.name = 'Beauty & Personal Care'
ON CONFLICT (name, category_id) DO NOTHING;

-- Add initial subcategories for Home & Kitchen
INSERT INTO product_subcategories (name, category_id)
SELECT 
    subcategory,
    pc.id
FROM 
    product_categories pc,
    (VALUES 
        ('Kitchen Appliances'),
        ('Cookware'),
        ('Home Decor'),
        ('Cleaning Supplies'),
        ('Storage & Organization'),
        ('Bedding & Bath')
    ) AS subcategories(subcategory)
WHERE 
    pc.name = 'Home & Kitchen'
ON CONFLICT (name, category_id) DO NOTHING;

-- Add initial subcategories for Health & Wellness
INSERT INTO product_subcategories (name, category_id)
SELECT 
    subcategory,
    pc.id
FROM 
    product_categories pc,
    (VALUES 
        ('Supplements'),
        ('Fitness Equipment'),
        ('Yoga & Meditation'),
        ('Medical Devices'),
        ('Natural Remedies'),
        ('Health Monitors')
    ) AS subcategories(subcategory)
WHERE 
    pc.name = 'Health & Wellness'
ON CONFLICT (name, category_id) DO NOTHING;

-- Add initial subcategories for Fashion & Apparel
INSERT INTO product_subcategories (name, category_id)
SELECT 
    subcategory,
    pc.id
FROM 
    product_categories pc,
    (VALUES 
        ('Clothing'),
        ('Footwear'),
        ('Accessories'),
        ('Jewelry'),
        ('Bags & Wallets'),
        ('Sustainable Fashion')
    ) AS subcategories(subcategory)
WHERE 
    pc.name = 'Fashion & Apparel'
ON CONFLICT (name, category_id) DO NOTHING; 