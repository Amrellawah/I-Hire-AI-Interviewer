export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.image) {
      return Response.json({
        error: 'No image data provided',
        mobile_detected: false,
        confidence: 0
      }, { status: 400 });
    }
    
    // Forward request to Python backend
    const pythonResponse = await fetch('http://localhost:5000/api/detect-mobile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: body.image })
    });
    
    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json();
      console.error('Python backend error:', errorData);
      
      return Response.json({
        error: 'Detection service unavailable',
        mobile_detected: false,
        confidence: 0,
        fallback: true
      }, { status: 503 });
    }
    
    const result = await pythonResponse.json();
    return Response.json(result);
    
  } catch (error) {
    console.error('API route error:', error);
    
    return Response.json({
      error: 'Internal server error',
      mobile_detected: false,
      confidence: 0,
      fallback: true
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Health check for Python backend
    const pythonResponse = await fetch('http://localhost:5000/api/health', {
      method: 'GET'
    });
    
    if (!pythonResponse.ok) {
      return Response.json({
        status: 'unhealthy',
        backend_available: false,
        message: 'Python backend not responding'
      }, { status: 503 });
    }
    
    const result = await pythonResponse.json();
    return Response.json({
      status: 'healthy',
      backend_available: true,
      ...result
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    
    return Response.json({
      status: 'unhealthy',
      backend_available: false,
      error: error.message
    }, { status: 503 });
  }
} 