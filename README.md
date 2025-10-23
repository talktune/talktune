# TalkTune 🎙️

A modern AI-powered interview platform built with NestJS, Next.js, and real-time WebSocket communication.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## 🚀 Overview

TalkTune is an intelligent interview platform that leverages AI to conduct real-time interviews with candidates. The platform features:

- **Real-time Communication**: WebSocket-based live interviews
- **AI-Powered Interviews**: Dynamic question generation and evaluation
- **Text-to-Speech**: Natural voice interactions
- **Speech Recognition**: Real-time speech-to-text conversion
- **Modern UI**: Responsive design with Material-UI and Tailwind CSS

## ✨ Features

- 🎯 **Dynamic Interview Questions**: AI-generated questions based on job requirements
- 🎙️ **Real-time Audio**: High-quality audio streaming and recording
- 🗣️ **Voice Interaction**: Text-to-speech and speech recognition
- 📊 **Interview Analytics**: Detailed performance metrics and insights
- 🔐 **Secure Authentication**: JWT-based authentication system
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🚀 **Real-time Updates**: Live interview progress and notifications

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **API**: GraphQL with Apollo Server
- **WebSockets**: Socket.IO for real-time communication
- **AI Integration**: OpenAI API with LangChain
- **Authentication**: JWT with Passport

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS + Material-UI
- **State Management**: SWR for data fetching
- **WebSocket Client**: Socket.IO Client
- **Forms**: Formik with Yup validation
- **Animations**: Lottie animations

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL
- **Environment**: Development and Production configurations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Docker** and **Docker Compose**
- **Git**

## ⚡ Quick Start

Get TalkTune running in minutes:

```bash
# Clone the repository
git clone <repository-url>
cd talktune

# Set up environment files
cp envs/backend.env.template envs/backend.env
cp envs/frontend.env.template envs/frontend.env
cp envs/postgres.env.template envs/postgres.env

# Start the database
cd docker
docker compose -f compose.dev.yaml up -d

# Install and start backend
cd ../backend
npm install
npm run start:watch

# Install and start frontend (in a new terminal)
cd ../frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application!

## 🔧 Development Setup

### 1. Environment Configuration

Navigate to the `envs` folder and create environment files:

```bash
cd envs
cp backend.env.template backend.env
cp frontend.env.template frontend.env
cp postgres.env.template postgres.env
```

### 2. Database Setup

Start the PostgreSQL database using Docker:

```bash
cd docker
docker compose -f compose.dev.yaml up -d
```

This will start:
- PostgreSQL database on port `5432`
- Database management interface (if configured)

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up database
npm run db:init

# Start in development mode
npm run start:watch
```

The backend will be available at:
- **GraphQL Playground**: `http://localhost:4000/graphql`
- **API Documentation**: `http://localhost:4000/api`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## 🚀 Production Setup

### 1. Environment Configuration

Configure production environment variables:

```bash
cd envs
cp backend.env.template backend.env
cp frontend.env.template frontend.env
cp postgres.env.template postgres.env
```

**Important**: Update all placeholder values with your production credentials.

### 2. Deploy with Docker

```bash
cd docker
docker compose -f compose.prod.yaml up -d
```

This will build and deploy:
- Production-ready backend container
- Production-ready frontend container
- PostgreSQL database with persistent storage

## 🔐 Environment Variables

### Backend Environment (`backend.env`)

```env
BCRYPT_SALT=your_bcrypt_salt
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432
DB_URL=postgres://user:password@postgres_db_prod/database_name
DB_USER=your_database_user
PORT=4000
OPENAI_API_KEY=your_openai_api_key
```

### Frontend Environment (`frontend.env`)

```env
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:4000
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/graphql
```

### PostgreSQL Environment (`postgres.env`)

```env
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_postgres_database
```

## 📚 API Documentation

### GraphQL Endpoint
- **Development**: `http://localhost:4000/graphql`
- **Production**: `https://your-domain.com/graphql`

### WebSocket Endpoint
- **Development**: `ws://localhost:4000`
- **Production**: `wss://your-domain.com`

### Available Queries & Mutations

The GraphQL schema includes:
- **Interviews**: Create, update, and manage interviews
- **Activities**: Track user activities and progress
- **Dynamic Prompts**: Generate AI-powered interview questions
- **Text-to-Speech**: Convert text to speech

## 📁 Project Structure

```
talktune/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── interviews/      # Interview management
│   │   ├── activity/        # Activity tracking
│   │   ├── dynamic-prompt/  # AI prompt generation
│   │   ├── text-to-speech/  # TTS functionality
│   │   └── ...
│   ├── package.json
│   └── Dockerfile
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   └── ...
│   ├── package.json
│   └── Dockerfile
├── docker/                  # Docker configurations
│   ├── compose.dev.yaml    # Development setup
│   └── compose.prod.yaml   # Production setup
├── envs/                    # Environment templates
│   ├── backend.env.template
│   ├── frontend.env.template
│   └── postgres.env.template
└── README.md
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart the database
cd docker
docker compose -f compose.dev.yaml restart
```

#### Port Already in Use
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:4000 | xargs kill -9  # Backend
lsof -ti:5432 | xargs kill -9  # PostgreSQL
```

#### Environment Variables Not Loading
- Ensure `.env` files are in the correct directories
- Check that all required variables are set
- Restart the services after changing environment variables

#### WebSocket Connection Issues
- Verify WebSocket URL in frontend environment
- Check firewall settings
- Ensure backend WebSocket server is running

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the API documentation
- Check Docker logs: `docker logs <container-name>`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- NestJS and Next.js communities
- All contributors and users

---

**Happy Interviewing! 🎉**