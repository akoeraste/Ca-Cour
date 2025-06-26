CREATE TABLE IF NOT EXISTS subscriptions(
    subscription_id UUID  PRIMARY KEY NOT NULL,
    user_id UUID  NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status VARCHAR  NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')),
    payment_id UUID  NOT NULL REFERENCES transactions(transaction_id) 
)