Hyper Store: Project README & Technical Documentation
This document provides a comprehensive overview of the Hyper Store project, including the project report, a detailed file structure explanation, and setup instructions.

In-Depth Project Report: Hyper Store E-commerce PWA
Author: Kishan
Date: August 2, 2025

1. Introduction
Hyper Store is a modern, full-stack e-commerce application designed to provide a seamless and futuristic shopping experience. The platform allows users to browse a variety of products, manage a shopping cart, and complete the checkout process. The application features a complete user authentication system with both local (email/password) and social (Google) login options, a user profile section to view order history and update personal information, and a responsive design that ensures a great user experience across all devices.

This project is architected with a decoupled frontend and backend, allowing for scalability and maintainability. The frontend is built with React and Vite, providing a fast and interactive user interface, while the backend is powered by Node.js, Express, and MongoDB, creating a robust and efficient server-side infrastructure. A key aspect of this project is its implementation as a Progressive Web App (PWA), enabling an installable, app-like experience with offline capabilities.

2. Technology Stack
The application is built using a modern MERN-like stack, leveraging the following technologies:

Frontend:
React (v18.3.1): A popular JavaScript library for building user interfaces with a component-based architecture.

Vite: A next-generation frontend tooling that provides a faster and leaner development experience.

React Router (v6.30.1): For declarative routing and navigation within the single-page application.

CSS: Custom styling is used to create a unique and modern "futuristic" theme for the application.

Lucide React: For clean and consistent icons throughout the application.

React Hot Toast: For providing user-friendly notifications and feedback.

Backend:
Node.js: A JavaScript runtime environment for building fast and scalable server-side applications.

Express: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

MongoDB: A NoSQL database used for storing product, user, and order data. Mongoose is used as the ODM for modeling and managing the data.

JSON Web Tokens (JWT): For securing the API and managing user authentication sessions.

Passport.js: A flexible and modular authentication middleware for Node.js, used here for implementing Google OAuth 2.0.

CORS: To enable Cross-Origin Resource Sharing, allowing the frontend application to securely make requests to the backend API from a different domain.

3. System Architecture and Data Flow
The application follows a modern, decoupled architecture with a separate frontend and backend. This separation of concerns is crucial for scalability and independent development cycles.

Data Flow Structure
The communication between the client (React App) and the server (Node.js API) is handled via RESTful API calls over HTTP.

User Interaction: A user interacts with the React application in their browser.

API Request: The React application makes an asynchronous API request (e.g., using fetch) to the Node.js backend. This request might be to fetch products, log in a user, or place an order. If the user is authenticated, a JWT is included in the Authorization header.

Backend Processing: The Express server receives the request and routes it to the appropriate controller. Middleware (like the auth middleware) may run first to verify the JWT.

Database Interaction: The controller interacts with the MongoDB database via Mongoose models to perform CRUD (Create, Read, Update, Delete) operations.

API Response: The backend sends a response back to the frontend, typically in JSON format. This could be the requested data (e.g., a list of products) or a success/error message.

UI Update: The React application receives the response, updates its state (e.g., using useState or a context), and re-renders the UI to reflect the new data.

Frontend Architecture
The frontend is a single-page application (SPA) built with React.

Component-Based UI: The UI is broken down into reusable components (e.g., ProductCard, Header, BottomNav), making the codebase modular and easy to maintain.

Client-Side Routing: React Router manages navigation between different "pages" (e.g., Home, Products, Cart) without requiring a full page reload, providing a fast and smooth user experience.

State Management:

AuthContext: Manages the global authentication state, storing the current user's data and JWT. This allows any component in the app to know if a user is logged in.

CartContext: Manages the shopping cart. It uses the browser's localStorage to persist the cart's contents, so the user's selections are not lost between sessions.

Backend Architecture
The backend is a RESTful API built with Node.js and Express, following a classic MVC-like pattern.

Models: Mongoose schemas in the /models directory define the structure for User, Product, and Order data.

Routes: Files in the /routes directory define the API endpoints (e.g., GET /api/products, POST /api/auth/login).

Controllers: The business logic for each route is contained within controller functions, which handle incoming requests, interact with the database, and send back responses.

Middleware: Middleware functions in the /middleware directory handle tasks like authentication (auth.js), where the JWT is verified to protect certain routes.

4. Core Functionalities Explained
User Authentication
The application supports two methods of authentication:

Local Authentication (Email/Password):

Registration: A user submits their name, email, and password. The backend hashes the password using bcrypt and saves the new user to the database.

Login: A user submits their email and password. The backend finds the user by email, compares the submitted password with the stored hash, and if they match, generates a JWT.

Google OAuth 2.0:

The user clicks the "Continue with Google" button, which redirects them to the backend's /api/auth/google route.

The backend, using Passport.js, redirects the user to Google's authentication screen.

After the user grants permission, Google redirects them back to a callback URL on the backend (/api/auth/google/callback).

The backend receives the user's Google profile information, finds or creates a user in the database, generates a JWT, and redirects the user back to the frontend's /auth/success page with the token in the URL parameters.

In both cases, the frontend receives a JWT, which it stores and includes in the headers of subsequent API requests to access protected resources.

Shopping Cart and Checkout
Client-Side Cart: The shopping cart is managed entirely on the frontend. When a user adds an item to the cart, the CartContext updates its state, and this state is immediately saved to localStorage. This approach is fast and works offline.

Checkout: When the user is ready to check out, the contents of the cart (from CartContext) are sent to the backend along with the shipping information. The auth middleware verifies the user's JWT, and if successful, a new Order document is created in the database with the user's ID, the items purchased, and the shipping address.

5. Progressive Web App (PWA) Implementation
A key feature of Hyper Store is its implementation as a PWA, which provides a more reliable, fast, and engaging user experience, similar to a native mobile app. This is achieved through the use of a Web App Manifest and a Service Worker.

What is a PWA?
A Progressive Web App is a web application that uses modern web capabilities to deliver an app-like experience to users. PWAs are built to be:

Reliable: Load instantly and never show the "downasaur," even in uncertain network conditions.

Fast: Respond quickly to user interactions with silky smooth animations and no janky scrolling.

Engaging: Feel like a natural app on the device, with an immersive user experience. This is achieved through features like an "Add to Home Screen" prompt, push notifications, and an offline-first architecture.

Web App Manifest (manifest.json)
The public/manifest.json file is a simple JSON file that tells the browser about your web application and how it should behave when 'installed' on the user's mobile device or desktop.

Key Properties:

name and short_name: The name of the app that is displayed to the user.

icons: A list of app icons in various sizes for different devices.

start_url: The page that should be loaded when the app is launched.

display: Set to standalone, which makes the app look and feel like a native app by hiding the browser UI.

background_color and theme_color: These are used to style the app's splash screen and the browser's toolbar.

This manifest file is what enables the "Add to Home Screen" prompt that allows users to install the app.

Service Worker (sw.js)
The service worker is the core of the PWA's offline capabilities. It's a JavaScript file that runs in the background, separate from the web page, and acts as a proxy between the web app, the browser, and the network.

Registration: The service worker is registered in src/main.jsx. This tells the browser to install and activate the service worker for the application.

Caching Strategy: The public/sw.js file implements a cache-first strategy for static assets.

Installation (install event): When the service worker is first installed, it pre-caches the application's "shell"—the essential HTML, CSS, JavaScript files, and icons. This ensures that the basic UI of the app can always be loaded, even without a network connection.

Activation (activate event): This event is used to manage caches and clean up any old, unused cache versions.

Fetching (fetch event): This is where the magic happens. The service worker intercepts every network request made by the application.

It first checks if the requested resource exists in its cache.

If it does, the service worker immediately returns the cached version, making the app load very quickly and work offline.

If the resource is not in the cache (e.g., an API call for product data), the service worker allows the request to proceed to the network. Once the data is fetched, it can optionally be cached for future offline use.

Offline Capability
Thanks to the service worker and its caching strategy, the Hyper Store has the following offline capabilities:

App Shell Loading: The main interface of the application (header, navigation, etc.) will load instantly from the cache, even if the user is offline.

Static Asset Access: All pre-cached static assets, like CSS, JavaScript, and images, are available offline.

Limitations: Dynamic content, such as the list of products or the user's order history, will not be available offline unless a more advanced caching strategy for API responses is implemented. The current implementation focuses on making the application shell available offline.

6. API Endpoint Reference
The backend exposes a RESTful API for the frontend to consume. Below is a summary of the available endpoints.

Authentication (/api/auth)
POST /register: Creates a new user account.

POST /login: Logs in a user and returns a JWT.

POST /logout: Logs out the user (currently a placeholder).

GET /me: (Protected) Gets the currently logged-in user's profile.

GET /google: Initiates the Google OAuth 2.0 authentication flow.

GET /google/callback: The callback URL for Google to redirect to after authentication.

Products (/api/products)
GET /: Gets a list of all products. Supports query parameters for searching, filtering, and sorting.

GET /:id: Gets a single product by its ID.

POST /: (Admin) Creates a new product.

PUT /:id: (Admin) Updates an existing product.

DELETE /:id: (Admin) Deletes a product.

Orders (/api/orders)
POST /: (Protected) Creates a new order.

GET /my-orders: (Protected) Gets all orders for the currently logged-in user.

GET /:id: (Protected) Gets a single order by its ID.

Users (/api/users)
GET /: (Admin) Gets a list of all users.

GET /profile: (Protected) Gets the profile of the currently logged-in user.

PUT /profile: (Protected) Updates the profile of the currently logged-in user.

7. Deployment
The application is deployed using a modern CI/CD workflow with separate hosting for the frontend and backend.

Frontend Deployment (Netlify):

The React frontend is deployed on Netlify.

The VITE_REACT_APP_API_URL environment variable is set in the Netlify dashboard to point to the Heroku backend URL.

Backend Deployment (Heroku):

The Node.js backend is deployed on Heroku.

The CLIENT_URL environment variable is set in the Heroku config vars to the URL of the Netlify frontend, which is crucial for the CORS configuration.

8. Conclusion
The Hyper Store is a robust and feature-rich full-stack e-commerce application that demonstrates a strong understanding of modern web development principles. The decoupled architecture, modern technology stack, and thoughtful feature implementation—especially its capabilities as a Progressive Web App—make it a solid foundation for a real-world online store.

Project Structure (File Tree)
Here is a detailed breakdown of the project's file structure, explaining the purpose of key directories and files.

Root Directory
react-ecommerce-app/
├── backend/      # Contains all backend (server-side) code
└── frontend/     # Contains all frontend (client-side) code

Backend Structure (/backend)
backend/
├── config/
│   └── passport.js      # Passport.js configuration for authentication strategies (e.g., Google OAuth)
├── middleware/
│   ├── auth.js          # Middleware to protect routes by verifying JWTs
│   └── validation.js    # Middleware for validating incoming request data
├── models/
│   ├── Order.js         # Mongoose schema and model for orders
│   ├── Product.js       # Mongoose schema and model for products
│   └── User.js          # Mongoose schema and model for users
├── routes/
│   ├── auth.js          # API routes for user authentication (login, register, Google)
│   ├── orders.js        # API routes for managing orders
│   ├── products.js      # API routes for managing products
│   └── users.js         # API routes for managing users
├── scripts/
│   ├── seed.js          # Script to populate the database with initial data
│   └── seedData.js      # The actual data used by the seed script
├── .env                 # Environment variables for the backend (DB URI, JWT secret, etc.)
├── server.js            # The main entry point for the backend server
└── package.json         # Lists backend dependencies and scripts

Frontend Structure (/frontend)
frontend/
├── public/
│   ├── icons/           # App icons for the PWA manifest
│   ├── images/          # Static product images
│   ├── manifest.json    # The Web App Manifest file for PWA functionality
│   └── sw.js            # The Service Worker file for offline capabilities and caching
├── src/
│   ├── admin/           # Components for the (future) admin dashboard
│   ├── assets/          # Static assets like SVGs
│   ├── components/      # Reusable React components (ProductCard, Header, etc.)
│   ├── pages/           # Page-level components (Home, ProductList, Cart, etc.)
│   ├── styles/          # CSS files for styling the application
│   ├── utils/
│   │   ├── api.js         # Centralized API request handling
│   │   ├── AuthContext.jsx  # React Context for managing authentication state
│   │   └── CartContext.jsx  # React Context for managing the shopping cart
│   ├── App.jsx            # The root component that sets up the application's routing
│   └── main.jsx           # The main entry point for the React application
├── .env                   # Environment variables for the frontend (API URL)
├── index.html             # The main HTML file for the single-page application
├── vite.config.js         # Configuration file for the Vite build tool
└── package.json           # Lists frontend dependencies and scripts
