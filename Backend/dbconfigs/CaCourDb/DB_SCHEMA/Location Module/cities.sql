CREATE TABLE IF NOT EXISTS cities(
    city_id UUID PRIMARY KEY NOT NULL,
    region_id UUID REFERENCES regions(region_id),
    name VARCHAR NOT NULL
);