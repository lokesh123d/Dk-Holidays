# DK Holidays Client - React + Vite

Frontend application for DK Holidays car rental.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```
Application will run on `http://localhost:3000`

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Features

- React 18 with Hooks
- Vite for fast development
- React Router for navigation
- Firebase Authentication (Google OAuth + Email/Password)
- Axios for API calls
- CSS Modules/styled components
- Responsive design

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API and Firebase services
├── styles/        # CSS files
├── utils/         # Utilities and contexts
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
