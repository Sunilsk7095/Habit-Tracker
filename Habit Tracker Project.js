/**
 * Personal Growth Habit Tracker
 * One-file full-stack demo (Express + MongoDB + Chart.js frontend)
 * Ready for GitHub internship submission
 */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// ===== MongoDB Setup =====
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/habit_tracker")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ===== Schemas =====
const HabitSchema = new mongoose.Schema({
  title: String,
  target: { type: Number, default: 1 },
});
const EntrySchema = new mongoose.Schema({
  habitId: mongoose.Schema.Types.ObjectId,
  date: String, // YYYY-MM-DD
  completed: { type: Boolean, default: false },
});

const Habit = mongoose.model("Habit", HabitSchema);
const Entry = mongoose.model("Entry", EntrySchema);

// ===== API Routes =====
app.get("/api/habits", async (req, res) => {
  res.json(await Habit.find());
});

app.post("/api/habits", async (req, res) => {
  const habit = new Habit(req.body);
  await habit.save();
  res.json(habit);
});

app.post("/api/entries", async (req, res) => {
  const { habitId, date, completed } = req.body;
  const entry = await Entry.findOneAndUpdate(
    { habitId, date },
    { $set: { completed } },
    { upsert: true, new: true }
  );
  res.json(entry);
});

app.get("/api/progress", async (req, res) => {
  const habits = await Habit.find();
  const today = new Date();
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  const data = [];
  for (let date of last30) {
    const entries = await Entry.find({ date });
    const completed = entries.filter((e) => e.completed).length;
    data.push({
      date,
      percent: habits.length ? Math.round((completed / habits.length) * 100) : 0,
    });
  }
  res.json(data);
});

// ===== Frontend (static HTML served by Express) =====
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Habit Tracker</title>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    input, button { padding: 8px; margin: 5px; }
    .habit { margin: 8px 0; }
  </style>
</head>
<body>
  <h1>Habit Tracker</h1>
  <input id="habitTitle" placeholder="New habit" />
  <button onclick="addHabit()">Add Habit</button>
  <div id="habits"></div>
  <h2>Progress (Last 30 Days)</h2>
  <canvas id="chart" width="600" height="200"></canvas>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    async function loadHabits() {
      const res = await fetch('/api/habits');
      const habits = await res.json();
      document.getElementById('habits').innerHTML = habits.map(h => 
        \`<div class="habit">
           <b>\${h.title}</b>
           <input type="checkbox" onchange="toggleHabit('\${h._id}', this.checked)">
         </div>\`
      ).join('');
    }

    async function addHabit() {
      const title = document.getElementById('habitTitle').value;
      if (!title) return;
      await fetch('/api/habits', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({title})
      });
      loadHabits();
      loadChart();
    }

    async function toggleHabit(habitId, completed) {
      const date = new Date().toISOString().slice(0,10);
      await fetch('/api/entries', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({habitId, date, completed})
      });
      loadChart();
    }

    async function loadChart() {
      const res = await fetch('/api/progress');
      const data = await res.json();
      const ctx = document.getElementById('chart').getContext('2d');
      if(window.chart) window.chart.destroy();
      window.chart = new Chart(ctx, {
        type:'line',
        data:{
          labels: data.map(d=>d.date),
          datasets:[{label:'% Completion', data:data.map(d=>d.percent)}]
        },
        options:{scales:{y:{beginAtZero:true,max:100}}}
      });
    }

    loadHabits();
    loadChart();
  </script>
</body>
</html>
  `);
});

// ===== Start server =====
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));
