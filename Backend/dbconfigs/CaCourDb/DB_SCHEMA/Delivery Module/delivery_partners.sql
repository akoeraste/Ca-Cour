CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS delivery_partners(
    partner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    contact_info TEXT,
    service_areas JSONB,
    rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
    status VARCHAR CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT current_timestamp 
)