# SaaS Todo App

A modern, single-user SaaS Todo application built with React, Redux Toolkit, Material-UI, and Firebase. Features a clean UI with dark mode, project/task management, and comprehensive unit testing.

## ✨ Features

- **Project Management**: Create and manage multiple projects
- **Task Management**: Full CRUD operations for tasks with status tracking
- **Modern UI**: Material-UI components with dark/light theme support
- **Authentication**: Firebase Authentication with Google sign-in
- **Real-time Data**: Firestore backend with real-time updates
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: User-friendly error messages for all API/network errors
- **Unit Testing**: Comprehensive test coverage for all core logic and components

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd saas-todo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env.local` file in the project root:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
   
   **⚠️ Important**: Never commit `.env.local` to version control.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 🏗️ Project Structure

```
src/
├── api/                 # Axios client and API configuration
├── app/                 # Redux store configuration
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Theme)
├── features/           # Feature-based modules
│   ├── projects/       # Project management logic
│   └── tasks/          # Task management logic
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # External service integrations
├── utils/              # Utility functions
└── routes.jsx          # Application routing
```

## 🧪 Testing

The project includes comprehensive unit tests for:
- Redux slices and async thunks
- Utility functions
- React components
- Custom hooks and contexts

**Run all tests:**
```bash
npm test
```

**Test coverage includes:**
- ✅ All Redux logic (reducers, actions, thunks)
- ✅ All utility functions
- ✅ All major UI components
- ✅ Custom hooks and contexts
- ✅ Error handling and edge cases

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI (MUI)
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library
- **Build Tool**: Vite
- **Linting**: ESLint

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint

## 🎨 Features in Detail

### Authentication
- Google sign-in integration
- Protected routes
- User session management

### Project Management
- Create, view, and manage projects
- Project-specific task filtering
- Quick project switching

### Task Management
- Create, edit, and delete tasks
- Task status tracking (Todo, In Progress, Done)
- Due date management
- Task assignment

### UI/UX
- Dark and light theme support
- Responsive design
- Modern Material-UI components
- Intuitive navigation

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Google provider)
3. Enable Firestore Database
4. Add your web app configuration to `.env.local`

### Environment Variables
All environment variables must be prefixed with `VITE_` to be accessible in the React app.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, Redux, and Firebase**
