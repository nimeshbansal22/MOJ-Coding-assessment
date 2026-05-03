# HMCTS DTS Developer Challenge - Task Manager

This repository contains my submission for the [HMCTS DTS Developer Challenge](https://github.com/hmcts/dts-developer-challenge). It is a simple Task Management system built for caseworkers.

## Technology Stack

The solution is divided into a robust, type-safe API backend and a responsive, fast frontend.

### Backend (`/backend`)
*   **Framework:** Java 21 & Spring Boot 3
*   **Database:** Local SQLite (using `xerial/sqlite-jdbc`) for a zero-configuration persistent setup.
*   **ORM:** Spring Data JPA + Hibernate
*   **Validation:** Jakarta Bean Validation (`@Valid`)
*   **Documentation:** Springdoc OpenAPI (Swagger UI) included automatically.
*   **Testing:** JUnit 5, Mockito, and Spring MockMvc.

### Frontend (`/frontend`)
*   **Framework:** React 18, bootstrapped with Vite
*   **Styling:** Vanilla CSS, focused on a modern and extremely clean "GOV.UK" inspired design (Navy blue, precise typography using Inter, clean card layouts).
*   **Testing:** Vitest & React Testing Library.

## Prerequisites

To run this application locally, you will need:
*   [Java 21](https://adoptium.net/)
*   [Maven 3.8+](https://maven.apache.org/)
*   [Node.js 18+](https://nodejs.org/) & `npm`

## Getting Started

### 1. Running the Backend

The backend will automatically create the `tasks.db` SQLite database file on startup and apply the JPA schema.

```bash
cd backend
mvn spring-boot:run
```
The backend API will run on `http://localhost:8080`.

**API Documentation:**
You can access the auto-generated Swagger interactive API documentation at:
`http://localhost:8080/swagger-ui.html`

### 2. Running the Frontend

In a separate terminal window, run the following:

```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.
*Note: Vite is configured to proxy all `/api` requests to the Spring Boot backend on 8080, preventing CORS issues.*

## Running the Automated Tests

### Backend Unit Tests
```bash
cd backend
mvn test
```

### Frontend Component Tests
```bash
cd frontend
npm test
```

## Application Features Overview
*   **Create Task:** Submit Title, Description, Due Date and Time.
*   **List Tasks:** Tasks are loaded on page load, automatically sorted by due date so the most pressing items are surfaced. Statistics automatically summarize totals at the top.
*   **Update Task Status:** Inline dropdown on each task card updates the status (To Do, In Progress, Done) seamlessly.
*   **Delete Task:** A delete button is provided, protected by a browser confirmation check.

Enjoy reviewing the code!
