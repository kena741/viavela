# AddisMenu AI Coding Agent Instructions

This document provides guidance for AI agents to effectively contribute to the AddisMenu codebase.

## Architecture Overview

The AddisMenu project is a monolithic repository containing two separate but related Node.js/Express applications: `admin` and `public`.

-   **`admin/`**: This is the administrative backend. It's an Express application for restaurant owners/managers to create and manage their hotel profiles, menus, and generate QR codes. It handles user authentication for admins.
-   **`public/`**: This is the customer-facing application. It's a separate Express application that displays the menus to restaurant patrons, likely by scanning a QR code that links to a specific menu.
-   **`database/`**: Contains the shared MongoDB connection logic (`db.js`) and Mongoose models (`models/`). Both the `admin` and `public` apps use this shared database layer.
-   **`shared/`**: Contains shared code, such as authentication middleware, used by both applications.

The core architectural pattern is two independent services that share a single database. Data flows from the `admin` app (where menus are created/updated) to the `public` app (where menus are displayed).

## Key Files

-   `package.json`: Defines all dependencies and scripts for the entire project.
-   `admin/app.js`: Entry point for the admin application.
-   `public/app.js`: Entry point for the public-facing menu application.
-   `database/db.js`: Establishes the connection to the MongoDB database.
-   `database/models/`: Defines the Mongoose schemas for `Hotel`, `MenuItem`, and `User`. These are central to the application's data structure.
-   `admin/routes/`: Defines the API endpoints for the admin panel.
-   `public/routes/`: Defines the routes for the public menu views.

## Developer Workflow

To run the application for development, use the following command. This will start both the `admin` and `public` servers with `nodemon`, enabling automatic restarts when files are changed.

```bash
npm run dev
```

To run the application in a production-like environment:

```bash
npm start
```

The `admin` app runs on one port, and the `public` app on another (check the respective `app.js` files for the exact ports, but they are typically around 3000 and 5000).

## Coding Conventions

-   **MVC-like Structure**: Both `admin` and `public` applications follow a Model-View-Controller-like pattern.
    -   **Routes**: Define the application's URL endpoints (`routes/`).
    -   **Controllers**: Contain the business logic for each route (`controllers/`).
    -   **Views**: Use EJS (`.ejs`) for server-side rendering (`views/`).
-   **Authentication**: The `admin` app uses a session-based authentication system. Key files are `admin/controllers/authcontroller.js` and `shared/middleware/auth.js`.
-   **Database Models**: When making changes to data structures, modify the Mongoose schemas in `database/models/`. These changes will affect both applications.
-   **Dependencies**: All `npm` packages are managed in the root `package.json` file. Do not create separate `package.json` files within the `admin` or `public` directories.
