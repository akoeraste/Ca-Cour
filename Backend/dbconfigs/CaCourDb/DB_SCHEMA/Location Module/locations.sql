CREATE TABLE IF NOT EXISTS locations(
    location_id UUID PRIMARY KEY,
    city_id UUID REFERENCES cities(city_id),
    address_line VARCHAR NOT NULL,
    postal_code VARCHAR,
    latitude NUMERIC NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude NUMERIC NOT NULL CHECK (longitude >= -180 AND longitude <= 180)
);