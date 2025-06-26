CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS user_verifications(
    verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id  UUID REFERENCES  users(user_id) UNIQUE ON DELETE CASCADE,
    verification_type VARCHAR DEFAULT 'email' NOT NULL CHECK(verification_type IN('email','phone','id')),
    verification_status VARCHAR DEFAULT 'pending' NOT NULL CHECK(verification_status IN('pending','verified','failed')),
    verification_date TIMESTAMPTZ DEFAULT current_timestamp
);