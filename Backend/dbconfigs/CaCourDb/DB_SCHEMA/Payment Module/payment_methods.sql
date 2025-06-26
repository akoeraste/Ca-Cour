CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS payment_methods(
    method_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type VARCHAR NOT NULL CHECK (type IN ('MTN MoMo', 'Orange Money', 'Credit Card')),
    details JSONB NOT NULL,
    is_default BOOLEAN
)