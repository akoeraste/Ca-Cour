CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS reviews(
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT current_timestamp NOT NULL
)