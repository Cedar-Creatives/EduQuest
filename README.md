# EduQuest

EduQuest is a modern web application that supports SDG 4 (Quality Education) by providing an interactive learning platform where students can take quizzes and access educational notes. The application offers both free and premium features, promoting interactive and engaging learning experiences for students of all ages.

## Overview

EduQuest uses a modern architecture built with ReactJS for the frontend and ExpressJS for the backend. Firebase services are integrated for real-time data management, authentication, and storage. The application adopts a freemium model, allowing users to start with free access and upgrade to premium for enhanced functionalities. OpenRouter AI APIs power intelligent quiz generation and educational content enhancement.

### Technologies Used

**Frontend:**
- ReactJS (Vite)
- shadcn-ui & Tailwind CSS
- React Router for client-side routing
- Axios for API requests
- Chart.js/Recharts for data visualization
- Firebase SDK (Authentication, Firestore)

**Backend:**
- ExpressJS
- Firebase Admin SDK (Authentication, Firestore)
- OpenRouter AI API integration
- RESTful API architecture

### Project Structure

**Frontend:**
- Located in the `client/` folder
- Page components in `client/src/pages/`
- UI components in `client/src/components/`
- API request handling in `client/src/api`
- Firebase configuration in `client/src/config/`

**Backend:**
- Located in the `server/` folder
- REST API endpoints in `server/routes/`
- Firebase services in `server/config/`
- OpenRouter AI integration in `server/services/`
- Authentication middleware in `server/routes/middleware/`

Both frontend and backend run concurrently using the `concurrently` package.

## Features

**Landing Page:**
- Interactive hero section
- Value propositions and pricing comparison
- Sign up, login, and guest access options

**Authentication:**
- Sign up with email/password or Google account
- Firebase Authentication integration
- Secure token-based authentication
- Password reset functionality

**Quiz Experience:**
- AI-powered quiz generation using OpenRouter
- Select subjects and difficulty levels
- Interactive quiz interface with real-time progress tracking
- Immediate feedback on answers with AI-enhanced explanations
- Auto-save progress

**Results & Tracking:**
- Detailed quiz results with performance insights
- Progress tracking and analytics
- Premium dashboard for deep insights and achievements

**Notes Library:**
- Search, filter, and preview notes
- AI-powered note summarization
- Upload own notes (premium users)
- Bookmark and highlight functionalities

**Freemium & Premium:**
- Daily quiz limits for free users (3 quizzes/day)
- Premium features include advanced analytics, unlimited quizzes, and note uploads
- Upgrade process through a simple interface

**Mobile Responsive:**
- Optimized for mobile with touch-friendly design
- Progressive Web App capabilities for offline access

## Getting Started

### Prerequisites

Before you start, ensure you have the following:

1. **Node.js** (latest LTS version recommended)
2. **npm** (Node package manager)
3. **Firebase Project** with Authentication and Firestore enabled
4. **OpenRouter API Key** for AI features

### Firebase Setup

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database

2. **Get Firebase Configuration:**
   - Go to Project Settings > Service Accounts
   - Generate new private key (download JSON file)
   - Copy the configuration values

3. **Get Frontend Firebase Config:**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the Firebase config object

### OpenRouter Setup

1. **Get OpenRouter API Key:**
   - Go to [OpenRouter](https://openrouter.ai/)
   - Sign up and get your API key
   - This enables AI-powered quiz generation and explanations

### Environment Configuration

1. **Backend Environment Variables:**
   - Copy `env.example` to `.env` in the root directory
   - Fill in your Firebase service account details
   - Add your OpenRouter API key

2. **Frontend Environment Variables:**
   - Create `.env.local` in the `client/` directory
   - Add your Firebase frontend configuration
   - Set the API URL

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd EduQuest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Backend: Copy Firebase service account details to `.env`
   - Frontend: Copy Firebase config to `client/.env.local`

4. **Run the project:**
   ```bash
   npm run start
   ```

This command will start both the frontend and backend servers concurrently. The frontend will be available on `http://localhost:5173` and the backend on `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-token` - Verify Firebase ID token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Quiz Management
- `GET /api/quiz/subjects` - Get all subjects
- `POST /api/quiz/subjects` - Create new subject
- `POST /api/quiz/generate` - AI-powered quiz generation
- `POST /api/quiz/explain` - AI-enhanced answer explanations
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get user quiz history

### AI Features
- **Quiz Generation:** Automatically creates educational questions using OpenRouter AI
- **Answer Explanations:** Provides detailed explanations for quiz answers
- **Subject Descriptions:** Generates engaging subject descriptions
- **Note Summarization:** AI-powered note content summarization
- **Smart Search:** Intelligent note search and ranking

## Development

### Adding New Features

1. **Backend Routes:** Add new endpoints in `server/routes/`
2. **Frontend Components:** Create new components in `client/src/components/`
3. **AI Integration:** Extend `server/services/openRouterService.js`

### Testing

- Backend health check: `GET /api/health`
- Developer help: `GET /api/help`
- Create test user: `POST /api/auth/create-test-user`

## License

The project is proprietary (not open source).

© 2024. All Rights Reserved.