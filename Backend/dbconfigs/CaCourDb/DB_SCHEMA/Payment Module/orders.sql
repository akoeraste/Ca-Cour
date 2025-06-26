CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(user_id),
    listing_id UUID NOT NULL REFERENCES listings(listing_id),
    seller_id UUID NOT NULL REFERENCES users(user_id),
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    status VARCHAR NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'delivered')),
    created_at TIMESTAMPTZ DEFAULT current_timestamp
)
---uddate delivery_id UUID NOT NULL REFERENCES deliveries(delivery_id),