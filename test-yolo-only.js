// Test script to verify YOLO-only mode
// Run this in your browser console during an interview

console.log('🧪 Testing YOLO-only mode...');

// Check if YOLO backend is available
async function testYOLOBackend() {
  try {
    const response = await fetch('/api/detect-mobile', {
      method: 'GET'
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ YOLO backend is healthy:', result);
      return true;
    } else {
      console.log('❌ YOLO backend is not responding');
      return false;
    }
  } catch (error) {
    console.log('❌ YOLO backend error:', error);
    return false;
  }
}

// Test device detection with a sample image
async function testDeviceDetection() {
  try {
    // Create a simple test image (1x1 pixel)
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
      console.log('✅ Device detection test result:', result);
      return result;
    } else {
      console.log('❌ Device detection test failed');
      return null;
    }
  } catch (error) {
    console.log('❌ Device detection test error:', error);
    return null;
  }
}

// Check CheatingDetection component settings
function checkComponentSettings() {
  // Look for the CheatingDetection component
  const detectionComponent = document.querySelector('[data-testid="cheating-detection"]') || 
                           document.querySelector('.cheating-detection');
  
  if (detectionComponent) {
    console.log('✅ CheatingDetection component found');
    return true;
  } else {
    console.log('❌ CheatingDetection component not found');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting YOLO-only mode tests...');
  
  const backendHealthy = await testYOLOBackend();
  const detectionResult = await testDeviceDetection();
  const componentFound = checkComponentSettings();
  
  console.log('\n📊 Test Results:');
  console.log(`Backend Health: ${backendHealthy ? '✅' : '❌'}`);
  console.log(`Detection Test: ${detectionResult ? '✅' : '❌'}`);
  console.log(`Component Found: ${componentFound ? '✅' : '❌'}`);
  
  if (backendHealthy && detectionResult && componentFound) {
    console.log('\n🎉 YOLO-only mode is working correctly!');
  } else {
    console.log('\n⚠️ Some tests failed. Check the issues above.');
  }
}

// Auto-run tests after 3 seconds
setTimeout(runTests, 3000);

// Export for manual testing
window.testYOLOOnly = {
  testBackend: testYOLOBackend,
  testDetection: testDeviceDetection,
  checkSettings: checkComponentSettings,
  runTests: runTests
}; 