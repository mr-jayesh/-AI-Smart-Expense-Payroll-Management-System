# AI Finance Backend (Java Spring Boot)

This is the Java Spring Boot version of the backend for the AI Smart Expense & Payroll System.

## Prerequisites

- **Java 17** or higher
- **Maven 3.8** or higher
- **PostgreSQL** database running

## Configuration

The database configuration is located in `src/main/resources/application.properties`.
Ensure your PostgreSQL database matches these credentials or update the file:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/finance_db
spring.datasource.username=postgres
spring.datasource.password=password
```

## Running the Application

1. Open a terminal in this directory (`backend_java`).
2. Run the application using Maven:

```bash
mvn spring-boot:run
```

The server will start on **http://localhost:3000**.

## Project Structure

- `com.finance.app.model`: JPA Entities matching the database tables.
- `com.finance.app.repository`: Spring Data JPA repositories.
- `com.finance.app.service`: Business logic (Payroll calculation, AI integration).
- `com.finance.app.controller`: REST API endpoints.

## AI Integration

The `ExpenseService` communicates with the Python AI Engine at `http://localhost:8000/predict/anomaly`. Ensure the Python AI Engine is running when adding expenses.
