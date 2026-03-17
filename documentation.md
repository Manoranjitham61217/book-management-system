# ZenithBooks - System Documentation

## Introduction
ZenithBooks is a simple full-stack library manager. It uses a React frontend and a Spring Boot backend with a PostgreSQL database.

## Objectives
- Provide a responsive UI for CRUD operations on books.
- Implement secure JWT-based authentication and role-based access control.
- Enable efficient searching, filtering, and pagination of large book collections.
- Demonstrate modern full-stack development patterns.

## System Architecture & Connection Flow
The system follows a classic N-Tier architecture:
`Frontend (React) <-> Backend (Spring Boot API) <-> Database (PostgreSQL)`

### Connection Flow
1. **Frontend sends HTTP requests**: The React app uses Axios to send JSON payloads to the backend endpoints.
2. **CORS Policy**: The Spring Boot backend is configured to allow requests from the React application's origin.
3. **Backend Controller**: Receives the request, validates the input, and passes data to the Service layer.
4. **Service Layer**: Implements business logic (e.g., recommendation algorithms, permission checks).
5. **Repository Layer (JPA/Hibernate)**: Translates Java objects to SQL queries and interacts with PostgreSQL.
6. **JSON Response**: The API returns a structured JSON response with appropriate HTTP status codes (200, 201, 401, 403, 404, 500).
7. **UI Update**: React listens for the response and updates the DOM dynamically using Hooks.

### Security Implementation (JWT)
- **Generation**: Upon successful login, the `JwtUtil` class generates a signed token containing the username and roles.
- **Header**: The frontend attaches this token to the `Authorization` header as `Bearer <token>`.
- **Validation**: The `JwtAuthenticationFilter` on the backend intercepts every request, validates the token's signature and expiration, and sets the security context.

## Technology Stack
- **Frontend**: React, Axios, React Router, Lucide React (Icons), Vanilla CSS (Custom UI).
- **Backend**: Spring Boot 3.x, Spring Security, Spring Data JPA, JWT (jjwt).
- **Database**: PostgreSQL 15+.
- **Authentication**: JWT (JSON Web Token), BCrypt.

## API Endpoints List
| Method | Endpoint | Description | Role |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | User registration | PUBLIC |
| POST | `/api/auth/login` | Login & get JWT | PUBLIC |
| GET | `/api/books` | Get all books (paginated) | USER/ADMIN |
| GET | `/api/books/{id}` | Get book by ID | USER/ADMIN |
| POST | `/api/books` | Create new book | ADMIN |
| PUT | `/api/books/{id}` | Update book | ADMIN |
| DELETE | `/api/books/{id}` | Delete book | ADMIN |

## Future Enhancements
- Integration with external Book APIs (Google Books/Open Library).
- Mobile Application using React Native.
- Real-time notifications for book availability.
