# 🚀 Hybrid Deployment Guide

This guide explains how to deploy your AI Interview app using the **Hybrid Approach**:
- **Frontend**: Next.js on Vercel
- **Backend**: Python Flask API on separate server

## 📋 **Prerequisites**

### For Frontend (Vercel)
- ✅ Vercel account
- ✅ GitHub repository with your code
- ✅ Environment variables configured

### For Backend (Separate Server)
- ✅ Python 3.8+ server
- ✅ GPU support (recommended for YOLO)
- ✅ Public IP or domain
- ✅ SSL certificate (recommended)

## 🔧 **Step 1: Prepare Backend Server**

### Option A: Cloud Server (Recommended)
```bash
# Deploy to services like:
# - DigitalOcean Droplet
# - AWS EC2
# - Google Cloud Compute Engine
# - Azure VM
# - Railway
# - Render
# - Heroku
```

### Option B: Local Server (Development)
```bash
# Your current setup - works for development
python mobile_detection_api.py
```

## 🔧 **Step 2: Configure Backend**

### 1. Update CORS Settings
```python
# In mobile_detection_api.py
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://your-app.vercel.app",  # Your Vercel domain
    "http://localhost:3000",        # Local development
    "*"  # For testing (remove in production)
])
```

### 2. Add Environment Variables
```bash
# On your backend server
export FLASK_ENV=production
export PORT=5000
export HOST=0.0.0.0
```

### 3. Start Backend
```bash
# On your backend server
python mobile_detection_api.py
```

## 🔧 **Step 3: Deploy Frontend to Vercel**

### 1. Push to GitHub
```bash
git add .
git commit -m "Add hybrid deployment support"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings

### 3. Set Environment Variables
In Vercel dashboard, add:
```
YOLO_BACKEND_URL=https://your-backend-server.com
```

## 🔧 **Step 4: Test Deployment**

### 1. Test Backend Health
```bash
curl https://your-backend-server.com/api/health
```

### 2. Test Frontend
```bash
# Visit your Vercel app
https://your-app.vercel.app
```

## 📊 **Deployment Options Comparison**

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **Hybrid** | ✅ Full control<br>✅ GPU support<br>✅ Cost effective | ❌ More complex<br>❌ Two services to manage | Production apps |
| **Vercel Only** | ✅ Simple deployment<br>✅ Automatic scaling | ❌ No Python support<br>❌ Limited compute | Simple apps |
| **All-in-One Server** | ✅ Simple setup<br>✅ Single service | ❌ Limited scaling<br>❌ Higher costs | Small apps |

## 🔧 **Environment Variables**

### Frontend (Vercel)
```env
YOLO_BACKEND_URL=https://your-backend-server.com
NEXT_PUBLIC_BACKEND_URL=https://your-backend-server.com
```

### Backend (Your Server)
```env
FLASK_ENV=production
PORT=5000
HOST=0.0.0.0
MODEL_PATH=models/best.pt
```

## 🛠️ **Backend Server Setup Examples**

### DigitalOcean Droplet
```bash
# 1. Create droplet with Ubuntu
# 2. SSH into server
ssh root@your-server-ip

# 3. Install Python
sudo apt update
sudo apt install python3 python3-pip

# 4. Clone your repo
git clone https://github.com/your-username/ai-interview.git
cd ai-interview

# 5. Install dependencies
pip3 install -r requirements.txt

# 6. Start backend
python3 mobile_detection_api.py
```

### Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up
```

### Render
```bash
# 1. Connect GitHub repo to Render
# 2. Set build command: pip install -r requirements.txt
# 3. Set start command: python mobile_detection_api.py
# 4. Deploy automatically
```

## 🔍 **Testing Your Deployment**

### 1. Health Check
```bash
curl https://your-backend-server.com/api/health
```

### 2. Test Detection
```bash
curl -X POST https://your-backend-server.com/api/detect-mobile \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,/9j/4AAQ..."}'
```

### 3. Frontend Test
```javascript
// In browser console
fetch('/api/detect-mobile', {
  method: 'GET'
}).then(r => r.json()).then(console.log)
```

## 🚨 **Common Issues & Solutions**

### Issue: CORS Errors
**Solution:**
```python
# Update CORS in mobile_detection_api.py
CORS(app, origins=["https://your-app.vercel.app"])
```

### Issue: Backend Not Responding
**Solution:**
```bash
# Check if backend is running
ps aux | grep python

# Check logs
tail -f mobile_detection_api.log
```

### Issue: Environment Variables Not Working
**Solution:**
```bash
# In Vercel dashboard, verify:
YOLO_BACKEND_URL=https://your-backend-server.com
```

## 📈 **Monitoring & Maintenance**

### 1. Backend Monitoring
```bash
# Use tools like:
# - PM2 for process management
# - Nginx for reverse proxy
# - SSL certificates for HTTPS
```

### 2. Logs
```bash
# Check backend logs
tail -f mobile_detection_api.log

# Check Vercel logs
# In Vercel dashboard → Functions → Logs
```

### 3. Performance
```bash
# Monitor response times
# Monitor GPU usage (if applicable)
# Monitor memory usage
```

## 🎉 **Success Indicators**

✅ **Backend Health Check Returns:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "backend_available": true
}
```

✅ **Frontend Can Detect Devices:**
```json
{
  "mobile_detected": false,
  "confidence": 0,
  "detections": []
}
```

✅ **No CORS Errors in Browser Console**

## 🔄 **Updates & Maintenance**

### Update Backend
```bash
# On your server
git pull origin main
pip install -r requirements.txt
# Restart backend
```

### Update Frontend
```bash
# Push to GitHub
git push origin main
# Vercel auto-deploys
```

## 💰 **Cost Estimation**

### Monthly Costs (Approximate)
- **Vercel**: $0-20/month (depending on usage)
- **Backend Server**: $5-50/month (depending on specs)
- **Domain**: $10-15/year
- **Total**: $15-85/month

## 🎯 **Next Steps**

1. **Choose your backend hosting** (DigitalOcean, Railway, Render, etc.)
2. **Set up your backend server**
3. **Configure environment variables**
4. **Deploy to Vercel**
5. **Test the full integration**
6. **Monitor and optimize**

Your app will now work perfectly on Vercel with the hybrid approach! 🚀 