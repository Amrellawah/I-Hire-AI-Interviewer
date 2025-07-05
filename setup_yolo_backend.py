#!/usr/bin/env python3
"""
Setup script for YOLO Mobile Detection Backend
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        sys.exit(1)

def create_models_directory():
    """Create models directory if it doesn't exist"""
    models_dir = Path("models")
    if not models_dir.exists():
        models_dir.mkdir()
        print("📁 Created models directory")
    else:
        print("✅ Models directory exists")

def check_model_file():
    """Check if YOLO model file exists"""
    model_path = Path("models/best.pt")
    if not model_path.exists():
        print("⚠️  YOLO model file not found at models/best.pt")
        print("📝 Please place your trained YOLO model file at models/best.pt")
        print("   The model should be trained to detect mobile devices")
        return False
    else:
        print("✅ YOLO model file found")
        return True

def create_startup_script():
    """Create startup script for the backend"""
    script_content = """#!/bin/bash
# Startup script for YOLO Mobile Detection Backend

echo "🚀 Starting YOLO Mobile Detection Backend..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

# Check if model file exists
if [ ! -f "models/best.pt" ]; then
    echo "⚠️  Warning: YOLO model file not found at models/best.pt"
    echo "   The backend will start but detection may not work properly"
fi

# Start the Flask server
python3 mobile_detection_api.py
"""
    
    with open("start_backend.sh", "w") as f:
        f.write(script_content)
    
    # Make executable on Unix-like systems
    if os.name != 'nt':  # Not Windows
        os.chmod("start_backend.sh", 0o755)
    
    print("✅ Created startup script: start_backend.sh")

def create_windows_batch():
    """Create Windows batch file for startup"""
    batch_content = """@echo off
echo 🚀 Starting YOLO Mobile Detection Backend...

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if model file exists
if not exist "models\\best.pt" (
    echo ⚠️  Warning: YOLO model file not found at models\\best.pt
    echo    The backend will start but detection may not work properly
)

REM Start the Flask server
python mobile_detection_api.py
pause
"""
    
    with open("start_backend.bat", "w") as f:
        f.write(batch_content)
    
    print("✅ Created Windows batch file: start_backend.bat")

def test_backend():
    """Test if the backend can start"""
    print("🧪 Testing backend startup...")
    try:
        # Import the Flask app to check for syntax errors
        import mobile_detection_api
        print("✅ Backend code is valid")
    except ImportError as e:
        print(f"❌ Failed to import backend: {e}")
        return False
    except Exception as e:
        print(f"❌ Backend test failed: {e}")
        return False
    
    return True

def main():
    """Main setup function"""
    print("🔧 Setting up YOLO Mobile Detection Backend")
    print("=" * 50)
    
    # Check Python version
    check_python_version()
    
    # Install requirements
    install_requirements()
    
    # Create models directory
    create_models_directory()
    
    # Check model file
    model_exists = check_model_file()
    
    # Create startup scripts
    create_startup_script()
    create_windows_batch()
    
    # Test backend
    if test_backend():
        print("\n✅ Setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Place your YOLO model file at models/best.pt")
        print("2. Start the backend:")
        if os.name == 'nt':  # Windows
            print("   - Double-click start_backend.bat")
        else:
            print("   - Run: ./start_backend.sh")
        print("3. The backend will be available at http://localhost:5000")
        print("4. Your Next.js app will automatically use the YOLO backend")
        
        if not model_exists:
            print("\n⚠️  Note: You need to add your YOLO model file for full functionality")
    else:
        print("\n❌ Setup failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main() 