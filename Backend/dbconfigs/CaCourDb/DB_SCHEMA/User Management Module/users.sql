CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS users(
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR UNIQUE,
    phone_number VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'buyer' NOT NULL CHECK (role IN ('buyer', 'seller', 'both')),
    status VARCHAR NOT NULL CHECK (status IN ('active', 'banned', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ DEFAULT current_timestamp 
);