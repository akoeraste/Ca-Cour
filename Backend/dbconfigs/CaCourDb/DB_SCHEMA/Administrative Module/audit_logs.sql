CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS audit_logs(
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admin_users(admin_id) ON DELETE CASCADE,
    action VARCHAR NOT NULL,
    target_type VARCHAR NOT NULL CHECK (target_type IN ('user', 'listing', 'order')),
    target_id UUID ,
    details JSONB NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT current_timestamp NOT NULL
);