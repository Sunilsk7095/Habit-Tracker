# 🌱 Personal Growth Habit Tracker

A simple full-stack **Habit Tracker Web Application** built with **Node.js, Express, MongoDB, and Chart.js**.
This project helps users create habits, mark daily completion, and visualize progress over the last 30 days.


## 🚀 Features


* ✅ Create new habits
* ✅ Track daily habit completion
* ✅ Store habit data using MongoDB
* ✅ REST API built with Express.js
* ✅ 30-day progress visualization
* ✅ Interactive progress chart using Chart.js
* ✅ Single-file full-stack implementation

## 🛠️ Tech Stack
**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose

**Frontend**

* HTML
* CSS
* JavaScript
* Chart.js

## 📂 Project Structure

```
habit-tracker/
│
├── server.js        # Backend + API + Frontend
├── package.json     # Dependencies
├── README.md        # Project documentation
└── .env             # Environment variables
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/habit-tracker.git
```

### 2. Move into project folder

```bash
cd habit-tracker
```

### 3. Install dependencies

```bash
npm install
```

## 🔐 Environment Setup

Create a `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/habit_tracker
PORT=4000
```

## ▶️ Run the Application

Start the server:

```bash
node server.js
```

The app will run at:

```
http://localhost:4000
```

## 📌 API Endpoints

### Get all habits

```
GET /api/habits
```

### Create a habit

```
POST /api/habits
```

Example:

```json
{
  "title": "Exercise"
}
```

### Update habit completion

```
POST /api/entries
```

Example:

```json
{
  "habitId": "habit_id",
  "date": "2026-06-26",
  "completed": true
}
```

### Get progress data

```
GET /api/progress
```

Returns completion percentage for the last 30 days.

## 📊 How It Works

1. User creates a habit.
2. Habit is saved in MongoDB.
3. Daily completion status is stored as an entry.
4. Progress API calculates completion percentage.
5. Chart.js displays progress history.

## 🎯 Future Improvements

* User authentication
* Habit streak counter
* Delete/edit habits
* Mobile responsive UI
* Dark mode
* Weekly/monthly reports

## 👨‍💻 Author

Your Name

## 📄 License

This project is open-source and available under the MIT License.
