CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS moderation_actions (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admin_users(admin_id),
    report_id UUID NOT NULL REFERENCES reports(report_id),
    action_taken VARCHAR NOT NULL CHECK (action_taken IN ('warning_issued', 'user_banned')),
    notes TEXT,
    timestamp TIMESTAMPTZ DEFAULT current_timestamp
);