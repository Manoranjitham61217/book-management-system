# Book Management System - Setup Guide

## Prerequisites
- **Java 17 or higher**
- **Node.js (LTS version)**
- **PostgreSQL 15 or higher**
- **Maven 3.8+**

## Database Setup
1. Create a database named `bookdb` in PostgreSQL.
2. Run the SQL commands in `schema.sql` to initialize the tables.
3. Update `backend/src/main/resources/application.properties` with your PostgreSQL credentials.

## Backend Setup (Spring Boot)
1. Navigate to the `backend` directory.
2. Run `mvn clean install` to download dependencies.
3. Run `mvn spring-boot:run` to start the server at `http://localhost:8080`.

## Frontend Setup (React)
1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server (usually at `http://localhost:5173`).

## Environment Variables
- **Backend**: `JWT_SECRET`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.
- **Frontend**: `VITE_API_URL`.
