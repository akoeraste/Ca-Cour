CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS favorites(
    favorite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(listing_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT current_timestamp
)