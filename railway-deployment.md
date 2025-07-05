# 🚂 Railway Deployment Guide (EASIEST)

## 📋 **Prerequisites**
- ✅ GitHub account
- ✅ Railway account (free at railway.app)
- ✅ Your code pushed to GitHub

## 🚀 **Step-by-Step Railway Deployment**

### **Step 1: Prepare Your Repository**

Make sure your repository has these files:
```
ai-interview/
├── mobile_detection_api.py    # Main Flask app
├── requirements.txt           # Python dependencies
├── models/                   # YOLO models (optional)
└── README.md
```

### **Step 2: Create requirements.txt**
If you don't have one, create `requirements.txt`:
```txt
flask==2.3.3
flask-cors==4.0.0
opencv-python==4.8.1.78
ultralytics==8.0.196
torch==2.1.0
numpy==1.24.3
```

### **Step 3: Deploy to Railway**

#### **Method A: Railway CLI (Recommended)**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize Railway project
railway init

# 4. Deploy
railway up

# 5. Get your URL
railway domain
```

#### **Method B: Railway Dashboard**
1. **Go to** [railway.app](https://railway.app)
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway will auto-detect Python and deploy**

### **Step 4: Configure Environment Variables**

In Railway dashboard:
1. **Go to your project**
2. **Click "Variables" tab**
3. **Add these variables:**
```
FLASK_ENV=production
PORT=5000
HOST=0.0.0.0
```

### **Step 5: Test Your Deployment**

```bash
# Get your Railway URL (e.g., https://your-app.railway.app)
curl https://your-app.railway.app/api/health

# Should return:
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": 1234567890
}
```

### **Step 6: Update CORS for Your Domain**

In Railway dashboard, add this variable:
```
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

## 🎉 **Success Indicators**

✅ **Railway Deployment:**
- [ ] Project created successfully
- [ ] Build completed without errors
- [ ] App is running (green status)
- [ ] Health check returns `{"status": "healthy"}`

✅ **Backend URL:**
- [ ] URL is accessible (e.g., `https://your-app.railway.app`)
- [ ] No CORS errors
- [ ] Device detection works

## 🚨 **Common Railway Issues**

### **Issue: Build fails**
**Solution:**
- Check `requirements.txt` exists
- Verify Python version (Railway uses 3.9+)
- Check logs in Railway dashboard

### **Issue: App crashes**
**Solution:**
- Check logs in Railway dashboard
- Verify all dependencies in `requirements.txt`
- Check if model files are too large

### **Issue: CORS errors**
**Solution:**
- Add your Vercel domain to CORS settings
- Update `mobile_detection_api.py` CORS configuration

## 💰 **Railway Pricing**
- **Free tier**: $5/month credit
- **Your app**: ~$2-5/month
- **Very affordable!**

## 🎯 **Next Steps After Railway**

1. **Test your Railway URL**
2. **Note the URL for Vercel deployment**
3. **Proceed to Phase 3: Vercel deployment**

Your backend will be live and ready! 🚀 