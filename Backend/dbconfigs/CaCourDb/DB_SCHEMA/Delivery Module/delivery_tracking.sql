CREATE TABLE IF NOT EXISTS delivery_tracking(
    tracking_id UUID PRIMARY KEY,
    delivery_id UUID NOT NULL REFERENCES deliveries(delivery_id),
    status_update TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    location TEXT
);