CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS listings(
    listing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    category_id VARCHAR REFERENCES categories(category_id) ON DELETE CASCADE,
    price NUMERIC NOT NULL CHECK (price >= 0),
    condition VARCHAR NOT NULL CHECK (condition IN ('new','used')),
    location_id UUID REFERENCES locations(location_id),
    status VARCHAR DEFAULT 'active' NOT NULL CHECK (status IN ('active','sold','archived')),
    created_at TIMESTAMPTZ DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ DEFAULT current_timestamp
)