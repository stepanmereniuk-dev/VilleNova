CREATE TABLE events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NULL,
    date_range VARCHAR(255) NULL,
    description TEXT NULL,
    long_description LONGTEXT NULL,
    conditions TEXT NULL,
    tags JSON NULL,

    location_name VARCHAR(255) NULL,
    location_address VARCHAR(500) NULL,
    location_postal_code VARCHAR(20) NULL,
    location_city VARCHAR(255) NULL,

    registration_url VARCHAR(500) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES `users`(id)
);