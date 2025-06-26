CREATE TABLE IF NOT EXISTS referrals(
    referral_table_id UUID PRIMARY KEY NOT NULL,
    referrer_id UUID  REFERENCES users(user_id) ON DELETE CASCADE,
    referred_id UUID  REFERENCES users(user_id) ON DELETE CASCADE,
    referral_code VARCHAR  UNIQUE,
    bonus_awarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT current_timestamp NOT NULL
);