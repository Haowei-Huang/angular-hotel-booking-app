# Hotel Booking System

This project is a hotel booking system built using Angular, Angular Material, and Tailwind CSS. It provides functionalities for users to search and filter hotels, create bookings, and manage their profiles. Admin users have additional privileges for managing users, hotels, and bookings.

[Check out the React version here](https://github.com/Haowei-Huang/react-hotel-booking-app)


## Features

- User Authentication:
    - User registration
    - User login/logout
    - Change password
- Hotel Booking:
    - Search and filter hotels
    - Create bookings (admin cannot create bookings)
    - View past bookings
- Admin Dashboard:
    - Manage users (create, view, edit, delete)
    - View hotels
    - View bookings
    - Change own password

## Getting Started
To run the project locally, follow these steps:
1. Clone the repo
``` bash
git clone [repository-url]
cd hotel-booking-system
```
2. Install dependencies
``` bash
npm install
```
3. Create a .env file in the root directory and add your backend endpoint string:
``` env
NG_APP_DB_URL=[your_backend_url]
```
4. Set up the backend:
Ensure the backend API is running and accessible.
Create an admin in the database using the following format:
``` json
{
    "email": [adminEmail],
    "role": "admin",
    "password": [adminPassword]
}
```
5. Start the Angular development server:
``` bash
ng serve
```
6. Open your browser and navigate to http://localhost:4200 to view the application.

## Tech Stack
- Frontend:
    - Angular
    - Angular Material (for styling and UI components)
    - Tailwind CSS (for utility-first CSS framework)
- Backend: https://github.com/Haowei-Huang/express-mongoDB-backend
    - MongoDB
    - Node.js
    - Express.js
