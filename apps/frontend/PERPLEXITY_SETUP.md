# CodePilot AI - Perplexity Integration Setup

## Quick Setup Guide

### 1. Get Your Perplexity API Key
1. Visit [perplexity.ai](https://perplexity.ai) and create an account
2. Go to API Settings page
3. Add a payment method (Pro subscribers get $5 monthly credits)
4. Generate an API key

### 2. Configure Environment Variables
1. Copy your API key
2. Open `.env.local` in your project root
3. Add: `VITE_PERPLEXITY_API_KEY=your_api_key_here`
4. Restart your development server

### 3. Test the Integration
1. Open your CodePilot workspace
2. Click "Test API" in the chat header
3. If connected, start chatting with real AI!

## Features Enabled
- **Real-time web search** with current information
- **Source citations** for verified answers
- **Multi-agent specialists** for different tasks
- **Context learning** that remembers your project
- **Technology awareness** with latest frameworks

## Agent Specializations
- **Elite Coder**: sonar-pro model for production code
- **System Architect**: sonar-pro for comprehensive design
- **Code Guardian**: sonar-pro for security/performance
- **Tech Researcher**: sonar-pro with web search
- **Speed Demon**: sonar-small for rapid prototyping
- **Master Coordinator**: sonar-medium for task routing

## Troubleshooting
- **"API Not Connected"**: Check your API key in .env.local
- **"Request failed"**: Verify you have credits in your Perplexity account
- **Slow responses**: Normal for comprehensive searches
- **No citations**: Expected for some agent types and queries

Your CodePilot AI now has real-time intelligence! ??
