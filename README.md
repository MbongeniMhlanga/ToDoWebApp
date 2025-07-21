# React To-Do List Application with Express & PostgreSQL Backend

A full-stack To-Do List application built using React for the frontend and Express.js with PostgreSQL for the backend. The project supports creating, reading, updating, and deleting to-do items for weekdays (Monday to Friday). It comes with Docker and Docker Compose configuration for simplified deployment and development.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Run](#setup-and-run)
  - [Using Docker Compose (Recommended)](#using-docker-compose-recommended)
  - [Running Backend Locally](#running-backend-locally)
  - [Running Frontend Locally](#running-frontend-locally)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Author](#author)

---

## Features

- Manage to-do items with fields for Monday to Friday
- RESTful API backend with Express.js
- PostgreSQL for reliable data storage
- React frontend with dynamic forms and list display
- Supports adding, editing, and deleting to-do items
- Dockerized backend, frontend, and PostgreSQL database for easy deployment
- CORS enabled to allow frontend-backend communication

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose

---

## Project Structure

```
ReactProject/
├── backend/
│ ├── controllers/ # Request logic (e.g. addTodo, deleteTodo)
│ ├── routes/ # Route handlers for /api endpoints
│ ├── errors/ # Custom error handling middleware
│ ├── db.js # PostgreSQL database connection
│ └── server.js # Main Express server
│
├── reactweb/
│ ├── public/ # manifest.json, icons, etc.
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── App.js # Main layout and routes
│ │ ├── List.js # Todo list screen
│ │ └── index.js # Entry point
│ └── package.json # Frontend dependencies
│
├── docker-compose.yml # Multi-service Docker config
└── README.md # You're here!
```

---

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (if not using Docker)

---

## Setup and Run

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

Access the frontend at `http://localhost:3000`  
Access the backend API at `http://localhost:2001`

### Running Backend Locally

1. Navigate to backend directory:

```bash
cd backend
npm install
```

2. Create a `.env` file with the following:

```
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=admin
PG_DATABASE=demobase
PG_PORT=5432
```

3. Start the server:

```bash
node server.js
```

### Running Frontend Locally

1. Navigate to frontend directory:

```bash
cd frontend
npm install
npm start
```

---

## API Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /todos           | Get all to-do items      |
| POST   | /todos           | Create a new to-do       |
| PUT    | /todos/:id       | Update an existing to-do |
| DELETE | /todos/:id       | Delete a to-do item      |

---

## Environment Variables

Defined in `.env` file (backend):

```
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=admin
PG_DATABASE=demobase
PG_PORT=5432
```

---

## Troubleshooting

- Ensure `.env` file is correctly defined and present in the backend folder
- Run `docker-compose down -v` to reset containers and volumes if PostgreSQL misbehaves
- Make sure ports `3000` and `2001` are free before running

---


## Author

**Mbongeni Mhlanga**  
Falcorp Graduate| Full-Stack Developer  
