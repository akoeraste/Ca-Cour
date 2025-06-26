CREATE TABLE IF NOT EXISTS transactions(
    transaction_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    currency VARCHAR,
    payment_method_id UUID NOT NULL REFERENCES payment_methods(method_id) ON DELETE CASCADE,
    transaction_type VARCHAR NOT NULL CHECK (transaction_type IN ('subscription', 'promotion')),
    status VARCHAR NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    timestamp TIMESTAMPTZ DEFAULT current_timestamp
);