# Traviax Backend API

A premium social travel platform API built with FastAPI, featuring a black & gold cinematic theme. This backend provides comprehensive travel-related services including user management, social features, AI-powered itinerary generation, and travel concierge services.

## 🚀 Features

- **Social Travel Features**: Reels, check-ins, places, and social interactions
- **AI-Powered Services**:
  - Intelligent itinerary generation
  - Travel concierge chat assistance
- **Travel Services**: Bookings, events, and place discovery
- **Real-time Chat**: Travel-focused chat functionality
- **Mock Data Support**: Development-friendly with comprehensive mock data

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Virtual environment (recommended)

## 🛠️ Installation

### 1. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

## ⚙️ Configuration

### 1. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your specific configuration:

```env

# External API Keys (Optional - will use mock responses if not provided)
OPENAI_API_KEY=your-openai-key-here

# Mock Data Configuration
MOCK_DATA_PATH=./mock_data/db.json
```

### 3. API Keys (Optional)

The application works with mock data by default. For production features, configure:

- **OpenAI API Key**: For AI-powered itinerary generation and chat

## 🚀 Running the Application

### Development Mode

```bash
# Make sure virtual environment is activated
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Run the development server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Alternative Run Method

```bash
python app/main.py
```

### Production Mode

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Core Framework

- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI applications
- **Pydantic**: Data validation and settings management

### External Integrations

- **OpenAI**: AI-powered features and chat

**Traviax Backend API** - Premium social travel platform with cinematic black & gold theme ✨
