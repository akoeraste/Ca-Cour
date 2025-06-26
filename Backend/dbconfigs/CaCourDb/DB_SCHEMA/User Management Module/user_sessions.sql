CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS user_sessions(
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    jwt_token VARCHAR NOT NULL UNIQUE,
    device_info TEXT,
    ip_address VARCHAR,
    login_time TIMESTAMPTZ DEFAULT current_timestamp NOT NULL,
    logout_time TIMESTAMPTZ DEFAULT current_timestamp
);