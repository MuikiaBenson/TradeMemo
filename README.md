TradeMemo : Where Trading Talks happen.

# TradeMemo 🧠📊  
_A modern trading journal for documenting trades, forecasts, and personal analysis._

---

## 📚 Table of Contents

- [Introduction](#introduction)
- [Live Demo](#live-demo)
- [Authors](#authors)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## 🧭 Introduction

**TradeMemo** is a full-stack web application designed exclusively for traders to post their trade ideas, insights, market outlooks, and share views on trades they have taken or plan to take. It provides a platform for traders to document, analyze, and share their trading journey with a like-minded community.

---

## 🚀 Live Demo

🔗 **Coming Soon...**  
_(Stay tuned for the hosted version of TradeMemo!)_

---

## 👤 Author

**Benson Muigai**  
GitHub: [@MuikiaBenson](https://github.com/MuikiaBenson)

---

## ⚙️ Installation

Follow these steps to set up the project on your local machine.

---

### 1. Clone the repository

```bash
git clone https://github.com/MuikiaBenson/TradeMemo.git
cd TradeMemo
2. Start MongoDB locally
Ensure MongoDB is running before starting the backend:

bash
Copy
Edit
sudo systemctl start mongod
3. Backend Setup
bash
Copy
Edit
cd backend
npm install
Create a .env file in the backend/ directory with the following content:

env
Copy
Edit
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/tradeMemoDB
JWT_SECRET=your_jwt_secret
Then run the backend server:

bash
Copy
Edit
npm run dev
4. Frontend Setup
In a new terminal tab or window:

bash
Copy
Edit
cd frontend
npm install
npm run dev
This will start the frontend on: http://localhost:5173

💡 Usage
Once both servers are running:

📝 Post trade ideas, insights, and market outlooks

📥 Upload screenshots and videos related to trades

📊 Share forecasts with daily or weekly market bias

📅 Manage and view your trade history on a dashboard calendar

🔐 Securely log in and manage your posts

🤝 Contributing
We welcome community contributions!

To contribute:
Fork this repository

Create a new branch:
git checkout -b feature/your-feature-name

Commit your changes:
git commit -m "feat: add your feature"

Push to GitHub:
git push origin feature/your-feature-name

Open a Pull Request against main
