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

### 2. Running the Backend (Supabase)

The backend relies on Docker. Please ensure you have **Docker Desktop** installed and **running** before proceeding.

1.  **(One-time) Install the Supabase CLI:**

    We recommend installing the CLI globally. For macOS users with Homebrew:
    ```bash
    brew install supabase
    ```
    For other operating systems, please follow the [official installation guide](https://supabase.com/docs/guides/cli/getting-started#install-the-cli).

2.  **(One-time) Set Up Local Environment Variables:**

    Our Edge Functions require an API key from OpenWeather.

    1. Create a new file at `supabase/functions/.env`.
    2. Add your API key to the file like this:
       ```
       OPENWEATHER_API_KEY=your_personal_openweather_api_key
       ```
    > **Important:** This `.env` file is listed in `.gitignore` and should never be committed to the repository.

3.  **Start the Supabase Local Services:**

    From the project's root directory (`/WeatherWear`), run:
    ```bash
    supabase start
    ```
    This command will start all necessary Docker containers (database, auth, functions, etc.). Wait for it to complete.
4. **See the logs: (if needed)**
    If you want to see the logs of the Supabase services, you can run:
    ```bash
    supabase function serve
    ```
    after starting the services. This will show you real-time logs from your Edge Functions.
5.  **(One-time) Connect the Frontend to the Local Backend:**

    After `supabase start` finishes, it will print a summary of your local environment. You need to find the `API URL` and the `anon key` (also called Publishable key) from this output.

    It will look something like this:
    ```
    ...
    supabase local development setup is running.

             API URL: http://127.0.0.1:54321
          Studio URL: http://127.0.0.1:54323
     Publishable key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
          Secret key: your-super-secret-key
    ...
    ```

    1. Create a new file at `weather-wear-frontend/.env.local`.
    2. Copy the `API URL` and `Publishable key` into the file like this:
       ```
       VITE_SUPABASE_URL=https://ixdfnmjzqpkszjyjqwmf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZGZubWp6cXBrc3pqeWpxd21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODM1MTksImV4cCI6MjA3NzI1OTUxOX0.DrL-ggXVNZzbqsEPO4f0nMnBL-MlALihZyZuOqk0WXE


       ```
6.  **Stopping the Backend:**

    When you are finished with your development session, you can stop all Supabase services by running:
    ```bash
    supabase stop
    ```
