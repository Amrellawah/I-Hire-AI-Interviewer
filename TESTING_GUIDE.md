# 🧪 Testing Guide: Local → Backend → Deployment

## 📋 **Testing Order: Do This First!**

### **Phase 1: Local Testing (REQUIRED)**
### **Phase 2: Backend Deployment Testing**
### **Phase 3: Full Deployment Testing**

---

## 🏠 **Phase 1: Local Testing**

### **Step 1: Start Your Backend**
```bash
# Terminal 1: Start Python backend
python mobile_detection_api.py

# You should see:
# ✅ YOLO model loaded successfully
# 🚀 Starting mobile detection API server...
```

### **Step 2: Start Your Frontend**
```bash
# Terminal 2: Start Next.js app
npm run dev

# You should see:
# Ready - started server on 0.0.0.0:3000
```

### **Step 3: Run Local Tests**
1. **Open browser** to `http://localhost:3000`
2. **Open browser console** (F12)
3. **Copy and paste** the `test-local-setup.js` content
4. **Check results** - all should be ✅

### **Step 4: Test Interview Flow**
1. **Start an interview**
2. **Allow camera access**
3. **Check if device detection works**
4. **Look for "YOLO-ONLY MODE"** in visualization

---

## 🌐 **Phase 2: Backend Deployment Testing**

### **Step 1: Choose Backend Hosting**
```bash
# Option A: Railway (Recommended - Easiest)
npm install -g @railway/cli
railway login
railway init
railway up

# Option B: Render
# Connect GitHub repo → Set build command → Deploy

# Option C: DigitalOcean
# Create droplet → SSH → Clone repo → Install dependencies
```

### **Step 2: Test Backend Health**
```bash
# Get your backend URL (e.g., https://your-app.railway.app)
curl https://your-backend-url.com/api/health

# Should return:
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": 1234567890
}
```

### **Step 3: Test Device Detection**
```bash
# Test with sample image
curl -X POST https://your-backend-url.com/api/detect-mobile \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,/9j/4AAQ..."}'

# Should return:
{
  "mobile_detected": false,
  "confidence": 0,
  "detections": [],
  "total_detections": 0
}
```

---

## 🚀 **Phase 3: Full Deployment Testing**

### **Step 1: Deploy to Vercel**
```bash
# Push to GitHub
git add .
git commit -m "Add deployment support"
git push origin main

# Connect to Vercel
# 1. Go to vercel.com
# 2. Import GitHub repo
# 3. Add environment variable: YOLO_BACKEND_URL=https://your-backend-url.com
# 4. Deploy
```

### **Step 2: Test Production Environment**
1. **Visit your Vercel app** (e.g., `https://your-app.vercel.app`)
2. **Open browser console** (F12)
3. **Run production test**:
   ```javascript
   // Test health check
   fetch('/api/detect-mobile', {
     method: 'GET'
   }).then(r => r.json()).then(console.log)
   ```

### **Step 3: Test Full Interview**
1. **Start an interview** on Vercel
2. **Check device detection** works
3. **Verify no CORS errors**
4. **Test all features**

---

## 🧪 **Testing Scripts**

### **Local Testing Script**
```javascript
// Copy test-local-setup.js content and paste in browser console
// This tests everything locally before deployment
```

### **Production Testing Script**
```javascript
// Test production deployment
async function testProduction() {
  console.log('🧪 Testing Production Deployment...');
  
  // Test health check
  const health = await fetch('/api/detect-mobile', {
    method: 'GET'
  }).then(r => r.json());
  
  console.log('Health check:', health);
  
  // Test device detection
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 100, 100);
  
  const imageData = canvas.toDataURL('image/jpeg', 0.8);
  
  const detection = await fetch('/api/detect-mobile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData })
  }).then(r => r.json());
  
  console.log('Device detection:', detection);
}

// Run test
testProduction();
```

---

## ✅ **Success Indicators**

### **Local Testing ✅**
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Health check returns `{"status": "healthy"}`
- [ ] Device detection works
- [ ] Webcam access granted
- [ ] No console errors

### **Backend Deployment ✅**
- [ ] Backend URL accessible
- [ ] Health check works
- [ ] Device detection works
- [ ] CORS configured properly

### **Full Deployment ✅**
- [ ] Vercel app loads
- [ ] Environment variables set
- [ ] Backend communication works
- [ ] Interview starts successfully
- [ ] Device detection works
- [ ] No CORS errors

---

## 🚨 **Common Issues & Solutions**

### **Issue: Backend not starting**
```bash
# Solution: Check Python version and dependencies
python --version  # Should be 3.8+
pip install -r requirements.txt
```

### **Issue: CORS errors**
```python
# Solution: Update CORS in mobile_detection_api.py
CORS(app, origins=["https://your-app.vercel.app"])
```

### **Issue: Environment variables not working**
```bash
# Solution: Redeploy Vercel after setting environment variables
# Check Vercel dashboard → Settings → Environment Variables
```

### **Issue: Model not loading**
```bash
# Solution: Check model file exists
ls models/best.pt
# If not, the backend will use standard YOLOv8 model
```

---

## 📊 **Testing Checklist**

### **Before Deployment**
- [ ] Local backend works
- [ ] Local frontend works
- [ ] Device detection works locally
- [ ] No console errors locally

### **After Backend Deployment**
- [ ] Backend URL accessible
- [ ] Health check works
- [ ] Device detection works
- [ ] CORS configured

### **After Full Deployment**
- [ ] Vercel app loads
- [ ] Environment variables set
- [ ] Backend communication works
- [ ] Interview works end-to-end

---

## 🎯 **Quick Test Commands**

### **Test Backend Locally**
```bash
curl http://localhost:5000/api/health
```

### **Test Backend Remotely**
```bash
curl https://your-backend-url.com/api/health
```

### **Test Frontend Locally**
```bash
# Visit http://localhost:3000
# Run test-local-setup.js in console
```

### **Test Frontend Remotely**
```bash
# Visit https://your-app.vercel.app
# Run production test script in console
```

---

## 🎉 **Ready to Deploy?**

**If all local tests pass ✅**, you're ready to deploy!

**Follow this order:**
1. **Deploy backend** to hosting service
2. **Test backend** remotely
3. **Deploy frontend** to Vercel
4. **Test full deployment**

Your app will work perfectly! 🚀 