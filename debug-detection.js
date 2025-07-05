// Debug script to test YOLO detection and see what classes are being detected
// Run this in your browser console during an interview

console.log('🔍 Debugging YOLO detection...');

// Test debug detection endpoint
async function debugDetection() {
  try {
    // Get the current webcam video element
    const videoElement = document.querySelector('video');
    if (!videoElement) {
      console.log('❌ No video element found');
      return;
    }

    // Create canvas and capture frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    console.log('📸 Captured frame:', {
      width: videoElement.videoWidth,
      height: videoElement.videoHeight,
      imageSize: imageData.length
    });

    // Call debug endpoint
    const response = await fetch('/api/debug-detection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Debug endpoint error:', errorText);
      return;
    }

    const result = await response.json();
    
    console.log('🔍 All detections:', result);
    
    // Show top detections
    if (result.all_detections && result.all_detections.length > 0) {
      console.log('\n📊 Top 10 detections:');
      result.all_detections.slice(0, 10).forEach((detection, index) => {
        console.log(`${index + 1}. ${detection.class_name} (class ${detection.class_id}) - ${Math.round(detection.confidence * 100)}% confidence`);
      });
      
      // Check for problematic detections
      const problematicClasses = ['person', 'face', 'head', 'hand', 'finger'];
      const problematicDetections = result.all_detections.filter(d => 
        problematicClasses.some(problem => d.class_name.toLowerCase().includes(problem))
      );
      
      if (problematicDetections.length > 0) {
        console.log('\n⚠️ Problematic detections (might be causing false positives):');
        problematicDetections.forEach(detection => {
          console.log(`- ${detection.class_name} (class ${detection.class_id}) - ${Math.round(detection.confidence * 100)}% confidence`);
        });
      }
    } else {
      console.log('✅ No detections found - this is good!');
    }
    
    return result;
  } catch (error) {
    console.log('❌ Debug detection error:', error);
    return null;
  }
}

// Test mobile detection specifically
async function testMobileDetection() {
  try {
    const videoElement = document.querySelector('video');
    if (!videoElement) {
      console.log('❌ No video element found');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    const response = await fetch('/api/detect-mobile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Mobile detection error:', errorText);
      return;
    }

    const result = await response.json();
    
    console.log('📱 Mobile detection result:', result);
    
    if (result.mobile_detected) {
      console.log('⚠️ Mobile device detected!');
      if (result.detections && result.detections.length > 0) {
        result.detections.forEach((detection, index) => {
          console.log(`Detection ${index + 1}:`);
          console.log(`- Class: ${detection.class_name || 'unknown'}`);
          console.log(`- Confidence: ${Math.round(detection.confidence * 100)}%`);
          console.log(`- Area ratio: ${(detection.area_ratio * 100).toFixed(2)}%`);
        });
      }
    } else {
      console.log('✅ No mobile device detected');
    }
    
    return result;
  } catch (error) {
    console.log('❌ Mobile detection test error:', error);
    return null;
  }
}

// Run comprehensive debug
async function runDebug() {
  console.log('🚀 Starting comprehensive debug...');
  
  console.log('\n1️⃣ Testing debug detection (all classes):');
  const debugResult = await debugDetection();
  
  console.log('\n2️⃣ Testing mobile detection (filtered):');
  const mobileResult = await testMobileDetection();
  
  console.log('\n📋 Summary:');
  if (debugResult && debugResult.all_detections) {
    console.log(`- Total detections: ${debugResult.all_detections.length}`);
    console.log(`- Frame size: ${debugResult.frame_size[0]}x${debugResult.frame_size[1]}`);
  }
  
  if (mobileResult) {
    console.log(`- Mobile detected: ${mobileResult.mobile_detected}`);
    console.log(`- Mobile detections: ${mobileResult.total_detections || 0}`);
  }
  
  console.log('\n💡 Recommendations:');
  console.log('- If you see "person" or "face" detections, they should be excluded');
  console.log('- Mobile detection should only trigger for actual devices');
  console.log('- Check the backend logs for more detailed information');
}

// Auto-run debug after 3 seconds
setTimeout(runDebug, 3000);

// Export for manual testing
window.debugDetection = {
  debugDetection,
  testMobileDetection,
  runDebug
}; 