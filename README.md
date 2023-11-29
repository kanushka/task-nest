# TaskNest Workspace

Welcome to TaskNest, a monorepo workspace dedicated to building and managing microservices for task management and related functionalities. TaskNest encompasses a variety of services, each focusing on a specific aspect of task management, from user handling to notifications.

## Services

TaskNest includes the following services:

## Environment Variables

The application uses the following environment variables:

- `JWT_SECRET_KEY`: Your JWT secret key. This is used to sign and verify JWT tokens for authentication.
- `PORT`: The port number on which the application runs.

Please ensure these environment variables are set in your environment before running the application.

### 1. User Service

- **Description**: Manages user authentication, creation, and management.
- **Technologies**: Node.js, Express, SQLite.
- **Endpoints**: `/create-user`, `/login`.

### 2. Todo Service

- **Description**: Handles the creation, updating, retrieval, and deletion of todo items.
- **Technologies**: Python, Flask, SQLite.
- **Endpoints**: `/add_todo`, `/get_todos`, `/delete_todo/{id}`.

### 3. Notification Service

- **Description**: Responsible for sending email notifications.
- **Technologies**: PHP.
- **Endpoints**: `/status`, `/send-notification`.


