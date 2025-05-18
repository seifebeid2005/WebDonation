-- Update causes table structure
ALTER TABLE causes
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS is_featured TINYINT(1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS current_amount DECIMAL(10,2) DEFAULT 0.00;

-- Update existing records to have default values
UPDATE causes 
SET category = 'general',
    is_featured = 0,
    current_amount = 0.00
WHERE category IS NULL 
   OR is_featured IS NULL 
   OR current_amount IS NULL; 