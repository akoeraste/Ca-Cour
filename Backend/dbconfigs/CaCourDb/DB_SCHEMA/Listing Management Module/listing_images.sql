CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS listing_images(
    image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(listing_id) ON DELETE CASCADE,
    image_url VARCHAR NOT NULL,
    is_primary BOOLEAN
)