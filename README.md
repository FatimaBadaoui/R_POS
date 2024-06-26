# Restaurant Management System

## Description
This backend system is designed for comprehensive management of restaurant operations. It facilitates user authentication, menu management, order processing, and generates end-of-day financial reports. Implemented using Express.js and MongoDB, it ensures robustness and scalability.

## Features
- **User Management:** Handles registration, authentication, work hours tracked, and user role management.
- **Menu Management:** Provides capabilities to add, update, delete, and view food and beverage items.
- **Order Processing:** Supports placing, updating, and deleting orders.
- **Stock Tracking:** Monitors and manages inventory levels of food and beverages, updating stock automatically as orders are placed and supplies are updated.
- **Receipt Handling:** Manages the generation and retrieval of receipts for transactions.
- **End-of-Day Reporting:** Automates the creation of financial reports at the end of each business day.
- **Security:** Implements role-based access control for different endpoints.

## Technologies Used
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JSON Web Tokens (JWT)**
- **React Native**
- **NativeWind (Tailwind)**
- **Expo**


## Installation
```
bash
git clone git@github.com:chimikoo/R_POS.git
cd [project-folder]
npm install
```

Create a .env file in the root directory and add the following:

```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

To start the server, run:

```
npm run dev
```

## API Documentation
### User Routes
- **`POST /users/register`** - Register a new user.
- **`POST /users/login`** - Authenticate a user and return a token.
- **`GET /users/logout`** - Log out a user and invalidate the token.
- **`GET /users/timeTrack/:month`** - Retrieve time tracking records for a specific month.
- **`PUT /users/forcedLogout`** - Force logout for users who have not logged out by the end of the day.
- **`GET /users/timeTrack`** - Retrieve time tracking records for the current user.
### Menu Item Routes
- **`GET /menuItems`** - Retrieve all menu items.
- **`POST /menuItems`** - Add a new menu item.
- **`PUT /menuItems/:id`** - Update an existing menu item.
- **`DELETE /menuItems/:id`** - Delete a menu item.
### Order Routes
- **`POST /orders`** - Place a new order.
- **`GET /orders/:id`** - Retrieve a specific order by ID.
- **`PUT /orders/:id`** - Update an existing order.
- **`DELETE /orders/:id`** - Cancel an existing order.
### Receipt Routes
- **`GET /receipts`** - Retrieve all receipts.
- **`POST /receipts`** - Create a new receipt for an order.
### EOD Routes
- **`GET /eod/reports`** - Generate an end-of-day report.


## Middleware Description
- **isAdminOrManager:** Validates if the user has admin or manager privileges.
- **isAuth:** Checks the authentication token and sets user context.
- **notFound:** Handles 404 errors for undefined routes.
- **errorHandler:** Catches and handles errors.

## Future Developments
We are currently building out the frontend for the application using react native.

## Contributing
Please fork the repository and submit pull requests for any enhancements. Your contributions are greatly appreciated!

## Contact
For any inquiries or further information, please contact via email: chimikoo@gmail.com
