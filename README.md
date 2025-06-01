# 💰 Personal Expense Tracker

A sleek and responsive web application to manage your personal finances effectively. Track your income and expenses, visualize spending patterns, and gain insights into your financial habits.

🔗 **Check project Live Demo Here**: [stirring-bubblegum-5552f5.netlify.app](https://stirring-bubblegum-5552f5.netlify.app/)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- 📈 **Dashboard**: Overview of total income, expenses, and balance.
- ➕ **Add Transactions**: Log income and expense entries with descriptions.
- 🗑️ **Delete Transactions**: Remove incorrect or outdated entries.
- 📊 **Expense Breakdown**: Visual representation of spending categories.
- 📅 **Date Filters**: View transactions for specific time frames.
- 💾 **Persistent Storage**: Data saved using local storage for session continuity.

---

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Backend

*No backend integration — application uses local storage for data persistence.*

### Deployment

![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

### Tools & Libraries

![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karthikeya-proj/personal-expense-tracker.git
### All Commands Used (Start to Deployment)
📦 1. Initialize the Project with Vite + React + TypeScript
npm create vite@latest project-name -- --template react-ts

📁 2. Navigate to Project Folder
cd project

📦 3. Install Dependencies
npm install

🎨 4. Install and Configure Tailwind CSS

npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p

Edit tailwind.config.js to add:
js.content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]

Edit src/index.css to include:
@tailwind base;

@tailwind components;

@tailwind utilities;

🧹 5. Optional Tools Installed

ESLint (seen in eslint.config.js)
npm install -D eslint

TypeScript settings were auto-handled by Vite's React-TS template

🧪 6. Run the Development Server

npm run dev
This runs the app locally (usually at http://localhost:5173).

🚀 7. Build for Production

npm run build

🌐 8. Deploy to Netlify

Either:
npm install netlify-cli -g

netlify deploy
Or you uploaded the dist/ folder via Netlify web UI.

-🔁 9. Version Control via Git & GitHub

git init
git remote add origin https://github.com/karthikeya-proj/personal-expense-tracker
git add .
git commit -m "Initial commit"
git push -u origin main
