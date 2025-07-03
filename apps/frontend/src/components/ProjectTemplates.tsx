import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  files: Array<{
    path: string;
    content: string;
  }>;
  dependencies?: string[];
  scripts?: Record<string, string>;
}

interface ProjectTemplatesProps {
  onTemplateSelect: (template: ProjectTemplate) => void;
  onClose: () => void;
}

export default function ProjectTemplates({ onTemplateSelect, onClose }: ProjectTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState('react');
  const [searchTerm, setSearchTerm] = useState('');

  const templates: ProjectTemplate[] = [
    {
      id: 'react-typescript',
      name: 'React + TypeScript',
      description: 'Modern React application with TypeScript, Tailwind CSS, and Vite',
      icon: '??',
      category: 'react',
      files: [
        {
          path: 'src/App.tsx',
          content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to React + TypeScript
          </h1>
          <p className="text-xl text-blue-100">
            Built with CodePilot AI
          </p>
        </header>
        
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">? Fast Development</h2>
            <p className="text-gray-600">Powered by Vite for lightning-fast development experience.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">?? Beautiful UI</h2>
            <p className="text-gray-600">Styled with Tailwind CSS for rapid UI development.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">?? Type Safe</h2>
            <p className="text-gray-600">Built with TypeScript for better developer experience.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;`
        },
        {
          path: 'src/main.tsx',
          content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
        },
        {
          path: 'src/index.css',
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`
        },
        {
          path: 'package.json',
          content: `{
  "name": "react-typescript-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}`
        }
      ],
      dependencies: ['react', 'react-dom', 'typescript', 'tailwindcss'],
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview'
      }
    },
    {
      id: 'node-express',
      name: 'Node.js + Express',
      description: 'RESTful API server with Express, TypeScript, and essential middleware',
      icon: '??',
      category: 'backend',
      files: [
        {
          path: 'src/server.ts',
          content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CodePilot API Server!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      error: 'Name and email are required'
    });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json(newUser);
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`?? Server running on port \${PORT}\`);
  console.log(\`?? API documentation: http://localhost:\${PORT}\`);
});`
        },
        {
          path: 'package.json',
          content: `{
  "name": "express-typescript-api",
  "version": "1.0.0",
  "description": "Express API server with TypeScript",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "@types/morgan": "^1.9.4",
    "@types/node": "^20.4.5",
    "tsx": "^3.12.7",
    "typescript": "^5.1.6"
  }
}`
        },
        {
          path: '.env.example',
          content: `PORT=3000
NODE_ENV=development
API_SECRET=your-secret-key-here`
        }
      ],
      dependencies: ['express', 'cors', 'helmet', 'morgan', 'dotenv'],
      scripts: {
        dev: 'tsx watch src/server.ts',
        build: 'tsc',
        start: 'node dist/server.js'
      }
    },
    {
      id: 'python-fastapi',
      name: 'Python FastAPI',
      description: 'Modern Python API with FastAPI, automatic docs, and async support',
      icon: '??',
      category: 'backend',
      files: [
        {
          path: 'main.py',
          content: `from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="CodePilot FastAPI Server",
    description="A modern Python API built with FastAPI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    age: Optional[int] = None

class UserCreate(BaseModel):
    name: str
    email: str
    age: Optional[int] = None

# In-memory storage (use database in production)
users_db = [
    {"id": 1, "name": "Alice Johnson", "email": "alice@example.com", "age": 28},
    {"id": 2, "name": "Bob Wilson", "email": "bob@example.com", "age": 32}
]

@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "Welcome to CodePilot FastAPI Server!",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "fastapi-server"}

@app.get("/users", response_model=List[User])
async def get_users():
    """Get all users"""
    return users_db

@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int):
    """Get a specific user by ID"""
    user = next((user for user in users_db if user["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user"""
    new_id = max([u["id"] for u in users_db], default=0) + 1
    new_user = {"id": new_id, **user.dict()}
    users_db.append(new_user)
    return new_user

@app.put("/users/{user_id}", response_model=User)
async def update_user(user_id: int, user: UserCreate):
    """Update an existing user"""
    user_index = next((i for i, u in enumerate(users_db) if u["id"] == user_id), None)
    if user_index is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = {"id": user_id, **user.dict()}
    users_db[user_index] = updated_user
    return updated_user

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    """Delete a user"""
    user_index = next((i for i, u in enumerate(users_db) if u["id"] == user_id), None)
    if user_index is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    deleted_user = users_db.pop(user_index)
    return {"message": f"User {deleted_user['name']} deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`
        },
        {
          path: 'requirements.txt',
          content: `fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6`
        },
        {
          path: 'README.md',
          content: `# FastAPI Server

A modern Python API built with FastAPI.

## Setup

1. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Run the server:
\`\`\`bash
python main.py
\`\`\`

3. Visit the docs at: http://localhost:8000/docs

## Features

- Automatic API documentation
- Type validation with Pydantic
- Async support
- CORS enabled
- RESTful endpoints`
        }
      ],
      dependencies: ['fastapi', 'uvicorn', 'pydantic'],
      scripts: {
        start: 'python main.py',
        dev: 'uvicorn main:app --reload'
      }
    },
    {
      id: 'nextjs-app',
      name: 'Next.js 14',
      description: 'Full-stack Next.js application with App Router, TypeScript, and Tailwind',
      icon: '?',
      category: 'fullstack',
      files: [
        {
          path: 'app/page.tsx',
          content: `export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to Next.js 14
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Built with App Router, TypeScript, and Tailwind CSS
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">? Server Components</h3>
              <p className="text-gray-600">
                Leverage the power of React Server Components for better performance.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">?? Tailwind CSS</h3>
              <p className="text-gray-600">
                Rapidly build modern websites without leaving your HTML.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">?? TypeScript</h3>
              <p className="text-gray-600">
                Build with confidence using static type checking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}`
        },
        {
          path: 'app/layout.tsx',
          content: `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js 14 App',
  description: 'Built with CodePilot AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`
        },
        {
          path: 'package.json',
          content: `{
  "name": "nextjs-14-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.0.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "eslint": "^8",
    "eslint-config-next": "14.0.0"
  }
}`
        }
      ]
    },
    {
      id: 'vue-composition',
      name: 'Vue 3 + Composition API',
      description: 'Modern Vue.js application with Composition API, TypeScript, and Vite',
      icon: '??',
      category: 'frontend',
      files: [
        {
          path: 'src/App.vue',
          content: `<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-green-500 to-teal-600">
    <div class="container mx-auto px-4 py-16">
      <header class="text-center mb-12">
        <h1 class="text-5xl font-bold text-white mb-4">
          Vue 3 + Composition API
        </h1>
        <p class="text-xl text-green-100">
          Modern Vue.js development with TypeScript
        </p>
      </header>

      <main class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div class="bg-white rounded-lg p-6 shadow-lg">
            <h2 class="text-2xl font-semibold mb-4">??? Composition API</h2>
            <p class="text-gray-600 mb-4">
              Take advantage of Vue 3's powerful Composition API for better code organization.
            </p>
            <div class="text-sm text-gray-500">
              Counter: {{ counter }}
            </div>
            <button 
              @click="increment"
              class="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Increment
            </button>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-lg">
            <h2 class="text-2xl font-semibold mb-4">?? TypeScript</h2>
            <p class="text-gray-600 mb-4">
              Full TypeScript support for better developer experience and type safety.
            </p>
            <div class="text-sm text-gray-500">
              Type: {{ typeof counter }}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-lg">
          <h2 class="text-2xl font-semibold mb-4">?? Todo List</h2>
          <div class="flex gap-2 mb-4">
            <input
              v-model="newTodo"
              @keyup.enter="addTodo"
              placeholder="Add a new todo..."
              class="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              @click="addTodo"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Add
            </button>
          </div>
          <ul class="space-y-2">
            <li 
              v-for="todo in todos" 
              :key="todo.id"
              class="flex items-center gap-2 p-2 border border-gray-200 rounded"
            >
              <input
                type="checkbox"
                v-model="todo.completed"
                class="rounded"
              />
              <span :class="{ 'line-through text-gray-500': todo.completed }">
                {{ todo.text }}
              </span>
              <button
                @click="removeTodo(todo.id)"
                class="ml-auto text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Counter example
const counter = ref(0)
const increment = () => {
  counter.value++
}

// Todo list example
interface Todo {
  id: number
  text: string
  completed: boolean
}

const newTodo = ref('')
const todos = reactive<Todo[]>([
  { id: 1, text: 'Learn Vue 3 Composition API', completed: false },
  { id: 2, text: 'Build amazing apps', completed: false }
])

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.push({
      id: Date.now(),
      text: newTodo.value,
      completed: false
    })
    newTodo.value = ''
  }
}

const removeTodo = (id: number) => {
  const index = todos.findIndex(todo => todo.id === id)
  if (index > -1) {
    todos.splice(index, 1)
  }
}
</script>

<style scoped>
/* Component-specific styles */
</style>`
        },
        {
          path: 'package.json',
          content: `{
  "name": "vue3-composition-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "typescript": "^5.0.2",
    "vue-tsc": "^1.4.2",
    "vite": "^4.4.5",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.0"
  }
}`
        }
      ]
    }
  ];

  const categories = [
    { id: 'react', name: 'React', icon: '??' },
    { id: 'frontend', name: 'Frontend', icon: '??' },
    { id: 'backend', name: 'Backend', icon: '??' },
    { id: 'fullstack', name: 'Full Stack', icon: '??' },
    { id: 'mobile', name: 'Mobile', icon: '??' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Templates</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center"
            >
              ?
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                selectedCategory === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <span>??</span>
              All Templates
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                  selectedCategory === category.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedCategory === 'all' ? 'All Templates' : categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <p className="text-gray-600 mt-1">
              Choose a template to get started quickly
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onTemplateSelect(template)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{template.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {template.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {template.description}
                      </p>
                      
                      {template.dependencies && (
                        <div className="mb-3">
                          <div className="text-xs font-medium text-gray-500 mb-1">Dependencies:</div>
                          <div className="flex flex-wrap gap-1">
                            {template.dependencies.slice(0, 4).map(dep => (
                              <span
                                key={dep}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {dep}
                              </span>
                            ))}
                            {template.dependencies.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                +{template.dependencies.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {template.files.length} files
                        </span>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                          Use Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">??</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No templates found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or category filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
