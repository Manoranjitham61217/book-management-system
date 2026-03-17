-- Book Management System - Database Schema

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    published_year INTEGER,
    count INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reading History Table (Optional Extension)
CREATE TABLE reading_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    read_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

-- Indexing for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_author ON books(author);

-- ER Diagram Explanation
-- 1. Users can have multiple entries in Reading History (One-to-Many).
-- 2. Books can appear in multiple users' Reading History (One-to-Many).
-- 3. Reading History acts as a joining table between Users and Books.
