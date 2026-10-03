# Smart Online Library Management System

A Java Spring Boot based **Smart Online Library Management System**
designed to digitize and simplify library operations for **Admin,
Librarian, and Student** users.

## 📚 Project Overview

The system provides a centralized platform for:

-   User authentication
-   Book management
-   Physical book-copy management
-   Book issue, return and renewal
-   Reservations
-   Automatic fine calculation
-   Notifications
-   Wishlist
-   Reports and analytics
-   Role-based dashboards

### Main Users

-   **Admin** --- Hemant Kaushal
-   **Librarian** --- Ompratap Solanki
-   **Student** --- Anshul Yadav

## ✨ Features

### Admin

-   Dashboard overview
-   User management
-   Book management
-   Book-copy management
-   Fine management
-   Reports and analytics
-   Notifications
-   Audit logs
-   Settings

### Librarian

-   Library dashboard
-   Book management
-   Book-copy management
-   Issue books
-   Return books
-   Renew books
-   Reservations
-   Members
-   Fines
-   Library reports
-   Notifications

### Student

-   Browse, search and filter books
-   My issued books
-   Due dates
-   Renew books
-   Reservations
-   Wishlist
-   Fines
-   Notifications
-   Borrowing history
-   Recommendations

## 🏗️ Architecture

``` text
Frontend
   ↓
REST Controller
   ↓
Service Layer
   ↓
Repository Layer
   ↓
JPA / Hibernate
   ↓
MySQL
```

The project follows a layered Spring Boot architecture with:

-   `controller`
-   `service`
-   `repository`
-   `entity`
-   `dto`
-   `config`
-   `exception`

DTOs are used for API responses so sensitive fields such as passwords
are not exposed.

## 🛠️ Technology Stack

### Backend

-   Java
-   Spring Boot
-   Spring Web MVC
-   Spring Data JPA
-   Hibernate
-   Spring Security
-   Maven

### Database

-   MySQL

### Frontend

-   HTML5
-   CSS3
-   JavaScript

### Tools

-   IntelliJ IDEA
-   Postman
-   Git
-   GitHub

## 📁 Project Structure

``` text
smart-library/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/hemant/smart_library/
│       │       ├── config/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── entity/
│       │       ├── exception/
│       │       ├── repository/
│       │       └── service/
│       │
│       └── resources/
│           ├── static/
│           │   ├── css/
│           │   ├── js/
│           │   ├── index.html
│           │   ├── admin-dashboard.html
│           │   ├── librarian-dashboard.html
│           │   └── student-dashboard.html
│           │
│           └── application.properties
│
├── pom.xml
└── README.md
```

## 🗄️ Database

Database name:

``` text
smart_library
```

Main tables/modules include:

``` text
users
books
book_copies
borrow_transactions
reservations
fines
notifications
wishlist
audit logs
```

## 🔐 Security

Spring Security is used for authentication.

Implemented security-related features include:

-   BCrypt password hashing
-   Authentication through Spring Security
-   Role information
-   DTO-based responses
-   Password excluded from user response DTOs
-   Global exception handling

**Never commit real database passwords or secrets to GitHub.**

## 🔌 Important API Endpoints

### Authentication

``` text
POST /api/auth/login
```

### Users

``` text
POST   /api/users
GET    /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
```

### Books

``` text
POST   /api/books
GET    /api/books
GET    /api/books/{id}
PUT    /api/books/{id}
DELETE /api/books/{id}
```

### Book Copies

``` text
POST   /api/book-copies/book/{bookId}
GET    /api/book-copies
GET    /api/book-copies/{id}
PUT    /api/book-copies/{id}/status
DELETE /api/book-copies/{id}
```

### Transactions

``` text
POST /api/transactions/issue
PUT  /api/transactions/{id}/return
PUT  /api/transactions/{id}/renew
GET  /api/transactions
GET  /api/transactions/{id}
GET  /api/transactions/user/{userId}
```

### Reservations

``` text
POST /api/reservations
GET  /api/reservations
GET  /api/reservations/{id}
GET  /api/reservations/book/{bookId}
GET  /api/reservations/user/{userId}
PUT  /api/reservations/{id}/status
PUT  /api/reservations/{id}/cancel
```

### Wishlist

``` text
POST   /api/wishlist
GET    /api/wishlist/user/{userId}
DELETE /api/wishlist/{id}
```

### Reports

``` text
GET /api/reports/issued
GET /api/reports/overdue
GET /api/reports/unpaid-fines
GET /api/reports/reservations
GET /api/reports/transactions
GET /api/reports/fines
```

## 💰 Fine Calculation

The current fine rule is:

``` text
Fine = Overdue Days × ₹5 per day
```

Fine statuses:

-   `NO_FINE`
-   `UNPAID`
-   `PAID`

## 📚 Reservation System

Reservations maintain:

-   User
-   Book
-   Reservation date
-   Status

Reservations are ordered by reservation date to support a FIFO-style
waiting queue.

The system also prevents duplicate active reservations for the same user
and book.

## ▶️ How to Run

### 1. Create the database

``` sql
CREATE DATABASE smart_library;
```

### 2. Configure MySQL

Edit:

``` text
src/main/resources/application.properties
```

Example:

``` properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_library
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3. Build

``` bash
mvn clean install
```

### 4. Run

``` bash
mvn spring-boot:run
```

Or run the Spring Boot main class from IntelliJ IDEA.

### 5. Open

``` text
http://localhost:8080/
```

## 🖥️ Login Flow

``` text
Smart Library
      ↓
Animated Logo 📚
      ↓
SMART ONLINE LIBRARY
MANAGEMENT SYSTEM
      ↓
ADMIN      LIBRARIAN      STUDENT
Hemant     Ompratap       Anshul
Kaushal    Solanki        Yadav
      ↓
✨ Loading Animation
      ↓
Login Screen
      ↓
Role-Based Dashboard
```

After successful authentication:

``` text
ADMIN      → admin-dashboard.html
LIBRARIAN  → librarian-dashboard.html
STUDENT    → student-dashboard.html
```

## 🧪 Testing Flow

Recommended testing sequence:

``` text
1. Create users
2. Create books
3. Create book copies
4. Login
5. Issue a book
6. View transaction
7. Renew the book
8. Return the book
9. Create reservation
10. Add wishlist item
11. Calculate fine
12. Pay fine
13. Check reports
14. Check dashboard statistics
```

## 🎯 Project Objectives

-   Digitize library operations
-   Reduce manual record keeping
-   Manage physical book copies
-   Simplify issue and return operations
-   Track due dates and fines
-   Provide reservation functionality
-   Provide role-specific dashboards
-   Improve library data visibility
-   Practice real-world Java and Spring Boot development

## 🚀 Future Enhancements

Possible future improvements:

-   JWT-based authentication
-   Advanced role-based authorization
-   Automatic reservation fulfillment
-   Automatic availability notifications
-   Email notifications
-   Advanced recommendation engine
-   Book reviews and ratings
-   Analytics charts
-   Swagger / OpenAPI documentation
-   Docker deployment
-   Cloud deployment
-   Pagination and advanced search
-   Improved audit logging

## 👨‍💻 Credits

**Smart Online Library Management System**

-   Admin: Hemant Kaushal
-   Librarian: Ompratap Solanki
-   Student: Anshul Yadav

------------------------------------------------------------------------

**Co-Powered by Hemant Kaushal**
