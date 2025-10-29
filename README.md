# 🌦️ Weather Wear

This is a weather-based outfit recommendation web application designed to provide personalized clothing suggestions based on real-time weather data and a user's personal wardrobe.

## 👩‍💻 Team Members

* Carlos Ortega
* Brandon Howar
* Sheng-Fang Chien
* Yu-Chieh Cheng

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite
* **Backend:** Supabase (Edge Functions, Auth, Postgres Database)
* **External APIs:** OpenWeather API
* **Design:** Figma

## 📁 Project Structure

This repository is a monorepo containing two main packages:

* `/weather-wear-frontend/`: The React (Vite) frontend application. This contains all the UI (User Interface) components.
* `/supabase/`: The Supabase backend. This contains our Edge Functions (API logic) and Database Migrations (database schema definitions).

---

## 🚀 Getting Started

To run this project locally, you will need to **run both** the frontend and backend services simultaneously.

### 1. Running the Frontend (React App)

1.  **Navigate to the frontend directory:**
    ```bash
    cd weather-wear-frontend
    ```

2.  **Install dependencies** (only needed once):
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` (or the URL shown in your terminal) in your browser.
<!--
### 2. Running the Backend (Supabase)

1.  **(One-time) Install Supabase CLI:**
    ```bash
    npm install supabase --save-dev
    ```
    *(Or follow the official docs to install it globally.)*

2.  **Navigate to the backend directory:**
    ```bash
    cd supabase
    ```

3.  **Start the Supabase local services:**
    ```bash
    supabase start
    ```

4.  The terminal will output your local API URL and `anon_key`. These are needed for the frontend to connect.-->
