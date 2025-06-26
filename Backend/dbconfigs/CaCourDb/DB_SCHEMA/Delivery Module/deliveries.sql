CREATE TABLE IF NOT EXISTS deliveries(
    delivery_id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    partner_id UUID NOT NULL REFERENCES delivery_partners(partner_id) ON DELETE CASCADE,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_fee NUMERIC NOT NULL CHECK (delivery_fee >= 0),
    status VARCHAR NOT NULL CHECK (status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
    tracking_number VARCHAR UNIQUE NOT NULL,
    estimated_delivery_time TIMESTAMPTZ NOT NULL
)