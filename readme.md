# My Awesome To-Do List Application

## Table of Contents
1.  [About The Project](#about-the-project)
2.  [Features](#features)
3.  [Live Demo](#live-demo) (Optional)
4.  [Technologies Used](#technologies-used)
5.  [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Firebase Configuration](#firebase-configuration)
6.  [Usage](#usage)
7.  [File Structure](#file-structure)
8.  [Screenshots](#screenshots)
9.  [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

---

## About The Project

This is a modern, full-stack To-Do List web application designed to help users organize their tasks efficiently. Built with a focus on a clean, spacious, and intuitive user interface, it provides a seamless experience for managing daily responsibilities.

I've put a lot of emphasis on the user experience, featuring:
* **A "Big UI"**: The layout is designed to maximize screen space, with large, clear input fields and task blocks for enhanced readability and ease of use.
* **Vertical Task Input**: Task name, description, and due date inputs are stacked vertically for a streamlined task creation process.
* **Motivational Quotes**: The dashboard greets you with a changing motivational quote to inspire productivity.
* **Secure Authentication**: Users can securely sign up and log in to manage their personalized task lists.

---

## Features

* **User Authentication**: Secure Sign Up and Login system.
* **Task Creation**: Easily add new tasks with a name, a detailed multi-line description, and a due date (using an intuitive calendar picker).
* **Task Management**:
    * Mark tasks as **Complete** or **Active**.
    * **Delete** tasks permanently.
* **Task Filtering**: View active tasks and completed tasks on separate tabs.
* **Responsive Design**: The application adjusts beautifully to various screen sizes (desktop, tablet, mobile).
* **Motivational Quotes**: Dynamic motivational quotes displayed on the dashboard.

---

## Live Demo (Optional)

You can check out a live demo of the application here:
[Link to your deployed application, if applicable]

---

## Technologies Used

* **Backend**:
    * [Node.js](https://nodejs.org/): JavaScript runtime environment.
    * [Express.js](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
    * [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup): For server-side interaction with Firebase services (Authentication, Firestore).
    * `cookie-parser`: Middleware to parse HTTP request cookies.

* **Frontend**:
    * **HTML5**: Structure of the web pages.
    * **CSS3**: Styling the application, including custom themes and responsive design.
    * **JavaScript (ES6+)**: Client-side logic and interactivity.
    * [Firebase Client SDK](https://firebase.google.com/docs/web/setup): For client-side user authentication and real-time database interactions (Firestore).
    * [Flatpickr](https://flatpickr.js.org/): A lightweight and powerful datetime picker.

* **Database**:
    * [Google Cloud Firestore](https://firebase.google.com/docs/firestore): NoSQL cloud database for storing task data.

* **Authentication**:
    * [Firebase Authentication](https://firebase.google.com/docs/auth): User authentication service.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/en/download/) (which includes npm)
* [Git](https://git-scm.com/downloads)
* A [Firebase Project](https://firebase.google.com/) set up with Firestore Database and Authentication enabled.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
    cd YOUR_REPOSITORY_NAME
    ```
    (Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub details.)

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Firebase Configuration:**
    * **Backend (`server.js`):**
        * Obtain your Firebase Service Account Key: Go to your Firebase Project Console -> Project settings -> Service accounts -> Generate new private key. This will download a JSON file (e.g., `your-project-name-firebase-adminsdk-xxxxx-xxxxxx.json`).
        * **Rename this file to `ServiceAccountKey.json`** and place it in the **root directory** of your project (the same folder as `server.js`).
        * **IMPORTANT:** Ensure `ServiceAccountKey.json` is listed in your `.gitignore` file to prevent it from being pushed to GitHub.
            ```
            # .gitignore
            ServiceAccountKey.json
            ```
    * **Frontend (`public/firebase-init.js`):**
        * Get your Firebase Web App configuration: Go to your Firebase Project Console -> Project settings -> General -> Your apps -> select your web app -> Firebase SDK snippet -> Config.
        * Copy the `firebaseConfig` object.
        * Open `public/firebase-init.js` and replace the placeholder `firebaseConfig` object with your actual configuration.
            ```javascript
            // public/firebase-init.js
            const firebaseConfig = {
              apiKey: "YOUR_API_KEY",
              authDomain: "YOUR_AUTH_DOMAIN",
              projectId: "YOUR_PROJECT_ID",
              storageBucket: "YOUR_STORAGE_BUCKET",
              messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
              appId: "YOUR_APP_ID"
            };
            ```

### Running the Application

1.  **Start the server:**
    ```bash
    node server.js
    ```
    The server will typically run on `http://localhost:3000`.

2.  **Access the application:**
    Open your web browser and go to `http://localhost:3000/signup.html` to create a new account, or `http://localhost:3000/login.html` if you already have one.

---

## Usage

* **Sign Up/Login**: Create an account or log in from the respective pages.
* **Add Task**: On the dashboard, fill in the 'Task Name', 'Task Description', and 'Due Date', then click 'Add Task'.
* **Manage Tasks**:
    * Click 'Mark Complete' on an active task to move it to the 'Completed Tasks' tab.
    * Click 'Mark Active' on a completed task to move it back to the 'Active Tasks' tab.
    * Click 'Delete' to remove a task permanently.
* **Navigate**: Use the 'Active Tasks' and 'Completed Tasks' tabs to filter your view.
* **Logout**: Click the 'Logout' button to sign out of your account.

---

## File Structure
