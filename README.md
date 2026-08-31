# AI-Based Question Paper Generator

A full-stack web application for generating AI-powered examination question papers. Built as a college **Software Engineering & Design Principles** project.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| AI | Google Gemini API (with mock fallback) |
| PDF | jsPDF |
| Auth | JWT |

## Features

- 🔐 Teacher login / registration
- 🤖 AI-powered question generation (Gemini API)
- 📝 Question Paper Builder with section management
- 👁️ A4-style paper preview
- ⬇️ PDF download & print

## Design Principles Demonstrated

| Principle | Where |
|-----------|-------|
| **SRP** | `aiService.js`, `questionService.js`, `paperService.js` |
| **Separation of Concerns** | React frontend / Express backend / MongoDB |
| **DRY** | `QuestionCard`, `Button`, `Toast`, `FormInput` components |
| **Modular Design** | Routes, Models, Services, Middleware all separated |

## Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- (Optional) Google Gemini API key

### 1. Clone & Configure

```bash
git clone <your-repo-url>
cd SE-lab
```

Edit `.env` in the root:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/question-paper-generator
JWT_SECRET=your-super-secret-key
AI_API_KEY=your-gemini-api-key   # optional, uses mock if not set
PORT=5000
```

### 2. Install & Run Backend

```bash
cd server
npm install
npm run dev
```

### 3. Install & Run Frontend

```bash
cd client
npm install
npm run dev
```

### 4. Open in Browser

```
http://localhost:3000
```

## User Flow

```
Login → AI Generator → Generate Questions → Add to Paper
     → Paper Builder → Configure Paper → Generate Paper
     → Paper Preview → Download PDF
```

## Project Structure

```
SE-lab/
├── client/          # React Frontend
│   └── src/
│       ├── components/   # Reusable UI (DRY)
│       ├── pages/        # 5 main pages
│       ├── context/      # Auth + Paper state
│       └── services/     # API layer
├── server/          # Express Backend
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   ├── services/    # Business logic (SRP)
│   └── middleware/  # JWT auth
├── .env             # Environment config
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register teacher |
| POST | /api/auth/login | Login |
| POST | /api/questions/generate | AI question generation |
| POST | /api/questions | Save question |
| GET | /api/questions | List questions |
| DELETE | /api/questions/:id | Delete question |
| POST | /api/papers | Save paper |
| GET | /api/papers | List papers |
| GET | /api/papers/stats | Dashboard stats |

## License

MIT — Built for educational purposes.
