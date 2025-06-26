CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS notification_preferences(
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    email_notifications BOOLEAN ,
    sms_notifications BOOLEAN ,
    push_notifications BOOLEAN 
);