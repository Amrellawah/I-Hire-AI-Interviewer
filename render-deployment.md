# 🎨 Render Deployment Guide (Alternative)

## 📋 **Prerequisites**
- ✅ GitHub account
- ✅ Render account (free at render.com)
- ✅ Your code pushed to GitHub

## 🚀 **Step-by-Step Render Deployment**

### **Step 1: Connect to Render**
1. **Go to** [render.com](https://render.com)
2. **Sign up/Login** with GitHub
3. **Click "New +"**
4. **Select "Web Service"**

### **Step 2: Connect Your Repository**
1. **Connect your GitHub account**
2. **Select your repository**
3. **Choose the repository with your Python backend**

### **Step 3: Configure Build Settings**
```
Name: ai-interview-backend
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: python mobile_detection_api.py
```

### **Step 4: Set Environment Variables**
In Render dashboard, add:
```
FLASK_ENV=production
PORT=5000
HOST=0.0.0.0
```

### **Step 5: Deploy**
1. **Click "Create Web Service"**
2. **Wait for build to complete**
3. **Get your URL** (e.g., `https://your-app.onrender.com`)

### **Step 6: Test Deployment**
```bash
curl https://your-app.onrender.com/api/health
```

## 🎉 **Success Indicators**
- [ ] Build completed successfully
- [ ] Service is running (green status)
- [ ] Health check returns `{"status": "healthy"}`

## 💰 **Render Pricing**
- **Free tier**: Available
- **Your app**: Free for basic usage
- **Upgrade**: $7/month for more resources

## 🎯 **Next Steps**
1. **Test your Render URL**
2. **Note the URL for Vercel deployment**
3. **Proceed to Phase 3: Vercel deployment** 