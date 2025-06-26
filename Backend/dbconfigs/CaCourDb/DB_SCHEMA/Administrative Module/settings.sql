CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS settings(
    setting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_key VARCHAR NOT NULL UNIQUE,
    set_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT current_timestamp NOT NULL
)