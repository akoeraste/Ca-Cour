CREATE TABLE IF NOT EXISTS promotions(
    promotion_id UUID PRIMARY KEY NOT NULL,
    listing_id UUID REFERENCES listings(listing_id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ  NOT NULL,
    end_date TIMESTAMPTZ  NOT NULL,
    promotion_type VARCHAR NOT NULL CHECK (promotion_type IN ('featured', 'top_listing')),
    payment_id UUID NOT NULL REFERENCES transactions(transaction_id) 
)