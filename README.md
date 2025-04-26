Health Program Management System
Overview
This is a Health Program Management System built with React, Express, and MySQL. The system allows doctors (system users) to manage health programs (such as TB, Malaria, HIV) and client information efficiently.

Features
Program Management

Create and manage health programs (e.g., TB, Malaria, HIV)

Client Management

Register new clients in the system

Enroll clients in one or more health programs

Search for clients from the registered list

View client profiles including their enrolled programs

API Integration

Expose client profiles via API for integration with other systems

Technologies Used
Frontend: React.js

Backend: Express.js (Node.js)

Database: MySQL

Additional Tools:

Axios for API calls

React Router for navigation

(Add any other libraries you used)

Installation
Prerequisites
Node.js (v14 or higher)

MySQL server

npm or yarn

Setup Instructions
Clone the repository

bash
git clone [your-repository-url]
cd health-program-management
Backend Setup

bash
cd backend
npm install
Create a .env file based on .env.example and configure your MySQL credentials

Run database migrations (include instructions if you have any)

Start the server:

bash
npm start
Frontend Setup

bash
cd frontend
npm install
npm start
Database Setup

Import the SQL schema (include the file if you have one)

Or run any migration scripts you've prepared

API Documentation
The system exposes the following API endpoints:

GET /api/clients - List all clients

GET /api/clients/:id - Get a specific client's profile

POST /api/clients - Register a new client

POST /api/programs - Create a new health program

POST /api/enrollments - Enroll a client in a program

Screenshots
![Screenshot 2025-04-26 154423](https://github.com/user-attachments/assets/a0f400f7-2dda-475f-8348-b8af85f88d28)
![Screenshot 2025-04-26 154413](https://github.com/user-attachments/assets/67c7c4da-ee6d-46ae-b8fd-4146ad42e744)
![Screenshot 2025-04-26 154352](https://github.com/user-attachments/assets/3d386bd9-4162-4d5c-8d3f-f4b2204bb8fe)
![Screenshot 2025-04-26 154440](https://github.com/user-attachments/assets/da914093-1b78-4f93-b6c6-9a26e412b3a9)
