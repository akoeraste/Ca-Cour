CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS user_profiles(
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    profile_picture_url VARCHAR,
    bio TEXT,
    location_id UUID NOT NULL REFERENCES locations(location_id)
);