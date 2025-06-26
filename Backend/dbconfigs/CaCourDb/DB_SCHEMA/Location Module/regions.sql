CREATE TABLE IF NOT EXISTS regions(
    region_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(country_id) ,
    name VARCHAR NOT NULL
)