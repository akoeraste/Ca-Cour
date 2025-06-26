CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS reports(
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reported_entity_type VARCHAR NOT NULL CHECK (reported_entity_type IN ('listing', 'user', 'message')),
    reported_entity_id UUID NOT NULL,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR NOT NULL CHECK (status IN ('pending', 'resolved', 'reviewed')),
    created_at TIMESTAMPTZ DEFAULT current_timestamp NOT NULL
);