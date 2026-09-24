# Video Notes AI

An AI-powered web application that converts **YouTube videos into structured notes and study material**. It is designed for tutorials, lectures, podcasts, and educational content, helping users understand long videos faster.

## ✨ Overview

Video Notes AI accepts a YouTube video URL, retrieves the available transcript, processes the content using an AI model, and generates structured learning material.

The generated output can include:

- Video summary
- Chapter-wise breakdown
- Key concepts
- Detailed notes
- Important points
- Flashcards

The project follows a **TypeScript-based MERN architecture** with AI-powered content analysis.

## 🚀 Key Features

- YouTube video URL processing
- Automatic transcript extraction
- AI-powered video summarization
- Structured notes generation
- Chapter and topic extraction
- Key concept identification
- Flashcard generation
- JWT-based authentication
- REST API architecture
- MongoDB data persistence
- TypeScript across frontend and backend
- Responsive React UI

## 🛠️ Tech Stack

### Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript
- REST APIs
- JWT Authentication

### Database

- MongoDB
- Mongoose

### AI & Processing

- Gemini API
- YouTube transcript extraction
- Zod for structured AI response validation

## 🏗️ Architecture

```text
User
  ↓
React + TypeScript Frontend
  ↓
Express REST API
  ↓
YouTube Transcript
  ↓
AI Processing
  ↓
Structured Analysis
  ↓
MongoDB
  ↓
Notes / Summary / Flashcards
```

## 📁 Project Structure

```text
video-note-ai/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.tsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── middleware/
│
└── README.md
```

## 🔐 Authentication

The application uses **JWT-based authentication** to protect user-specific resources.

```text
Register / Login
      ↓
JWT Authentication
      ↓
Authenticated Request
      ↓
Protected API
      ↓
User-specific Video Notes
```

## 🧠 AI Processing Flow

```text
YouTube URL
    ↓
Transcript Extraction
    ↓
Transcript Processing
    ↓
AI Model
    ↓
Structured JSON Response
    ↓
Validation
    ↓
Save / Display Analysis
```

AI responses are validated using structured schemas before being consumed by the application.

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB
- Gemini API key

### Installation

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

Create a backend `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

## 🔮 Future Scope

- Support for longer videos and large transcripts
- Improved transcript chunking and processing
- Better AI context management
- PDF/export functionality
- Search within generated notes
- User history and saved analyses
- Improved study and revision workflows
- Production deployment and optimization

## 👨‍💻 My Contribution

I worked on the full-stack development of the application, including:

- Building the React + TypeScript frontend
- Developing Express.js REST APIs
- Implementing JWT authentication
- Integrating MongoDB with Mongoose
- Integrating YouTube transcript extraction
- Integrating the AI model for video analysis
- Designing structured AI response schemas
- Building the video analysis and notes workflow
- Connecting frontend, backend, database, and AI services

## 📌 Project Status

The project is under active development and is being built as an AI-powered learning assistant for converting video content into structured study material.

---

**Developer:** Kshitija Narwade
