CREATE TABLE IF NOT EXISTS categories (
    category_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    parent_category_id VARCHAR REFERENCES categories(category_id)
);