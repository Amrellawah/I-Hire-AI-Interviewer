// Local Testing Script
// Run this BEFORE deploying to test everything locally

console.log('🧪 Starting Local Testing...');

// Test 1: Check if backend is running
async function testBackendHealth() {
  console.log('\n1️⃣ Testing Backend Health...');
  
  try {
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET'
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Backend is healthy:', result);
      return true;
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Backend not running or not accessible');
    console.log('💡 Make sure to run: python mobile_detection_api.py');
    return false;
  }
}

// Test 2: Test device detection with sample image
async function testDeviceDetection() {
  console.log('\n2️⃣ Testing Device Detection...');
  
  try {
    // Create a simple test image
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 100, 100);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    const response = await fetch('/api/detect-mobile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Device detection works:', result);
      return true;
    } else {
      console.log('❌ Device detection failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Device detection error:', error);
    return false;
  }
}

// Test 3: Test environment variables
function testEnvironmentVariables() {
  console.log('\n3️⃣ Testing Environment Variables...');
  
  // Check if we're in development mode
  const isDevelopment = window.location.hostname === 'localhost';
  
  if (isDevelopment) {
    console.log('✅ Running in development mode');
    console.log('💡 Backend URL will use localhost:5000');
    return true;
  } else {
    console.log('⚠️ Running in production mode');
    console.log('💡 Make sure YOLO_BACKEND_URL is set in Vercel');
    return true;
  }
}

// Test 4: Test webcam access
async function testWebcamAccess() {
  console.log('\n4️⃣ Testing Webcam Access...');
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log('✅ Webcam access granted');
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.log('❌ Webcam access denied:', error.message);
    console.log('💡 Make sure to allow camera access');
    return false;
  }
}

// Test 5: Test interview component
function testInterviewComponent() {
  console.log('\n5️⃣ Testing Interview Component...');
  
  // Check if interview components exist
  const videoElement = document.querySelector('video');
  const detectionComponent = document.querySelector('[data-testid="cheating-detection"]') || 
                           document.querySelector('.cheating-detection');
  
  if (videoElement) {
    console.log('✅ Video element found');
  } else {
    console.log('⚠️ Video element not found (might not be on interview page)');
  }
  
  if (detectionComponent) {
    console.log('✅ Detection component found');
  } else {
    console.log('⚠️ Detection component not found (might not be on interview page)');
  }
  
  return true;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Local Testing...');
  
  const results = {
    backend: await testBackendHealth(),
    detection: await testDeviceDetection(),
    environment: testEnvironmentVariables(),
    webcam: await testWebcamAccess(),
    component: testInterviewComponent()
  };
  
  console.log('\n📊 Test Results:');
  console.log(`Backend Health: ${results.backend ? '✅' : '❌'}`);
  console.log(`Device Detection: ${results.detection ? '✅' : '❌'}`);
  console.log(`Environment: ${results.environment ? '✅' : '❌'}`);
  console.log(`Webcam Access: ${results.webcam ? '✅' : '❌'}`);
  console.log(`Components: ${results.component ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Ready for deployment!');
    console.log('\n📋 Next steps:');
    console.log('1. Deploy backend to hosting service');
    console.log('2. Deploy frontend to Vercel');
    console.log('3. Set environment variables');
  } else {
    console.log('\n⚠️ Some tests failed. Fix issues before deploying.');
    console.log('\n🔧 Common fixes:');
    console.log('- Start backend: python mobile_detection_api.py');
    console.log('- Allow camera access in browser');
    console.log('- Check console for specific errors');
  }
  
  return allPassed;
}

// Auto-run tests after 2 seconds
setTimeout(runAllTests, 2000);

// Export for manual testing
window.localTesting = {
  testBackendHealth,
  testDeviceDetection,
  testEnvironmentVariables,
  testWebcamAccess,
  testInterviewComponent,
  runAllTests
}; 