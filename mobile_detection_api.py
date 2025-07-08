from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import base64
import numpy as np
from ultralytics import YOLO
import os
import logging
import torch

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global model variable
model = None

def load_model():
    """Load the YOLO model with fallback options"""
    global model
    try:
        # Try different model paths
        model_paths = [
            "models/best.pt",
            "models/best_yolov12.pt",
            "models/best_yolov8.pt"
        ]
        
        for model_path in model_paths:
            if os.path.exists(model_path):
                logger.info(f"Attempting to load model from: {model_path}")
                try:
                    # Try loading with different approaches
                    model = YOLO(model_path)
                    logger.info(f"✅ YOLO model loaded successfully from {model_path}")
                    return True
                except Exception as e:
                    logger.warning(f"Failed to load {model_path}: {e}")
                    continue
        
        # If all custom models fail, try to download a standard model
        logger.warning("All custom models failed. Attempting to use a standard YOLOv8 model...")
        try:
            # Try to load a standard YOLOv8 model
            model = YOLO('yolov8n.pt')  # This will download if not available
            logger.info("✅ Standard YOLOv8 model loaded successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to load standard model: {e}")
            return False
            
    except Exception as e:
        logger.error(f"Error in model loading: {e}")
        return False

@app.route('/api/detect-mobile', methods=['POST'])
def detect_mobile():
    """Detect mobile devices in the provided image"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'error': 'Model not loaded',
                'mobile_detected': False,
                'confidence': 0
            }), 500
        
        # Get image data from request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({
                'error': 'No image data provided',
                'mobile_detected': False,
                'confidence': 0
            }), 400
        
        image_data = data['image']
        
        # Decode base64 image
        try:
            # Remove data URL prefix if present
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                return jsonify({
                    'error': 'Invalid image data',
                    'mobile_detected': False,
                    'confidence': 0
                }), 400
                
        except Exception as e:
            logger.error(f"Error decoding image: {e}")
            return jsonify({
                'error': 'Invalid image format',
                'mobile_detected': False,
                'confidence': 0
            }), 400
        
        # Run YOLO detection
        results = model(frame, verbose=False)
        mobile_detected = False
        detections = []
        max_confidence = 0
        
        # Define mobile device classes for different YOLO models
        mobile_classes = {
            # Standard YOLOv8 COCO classes
            67: 'cell phone',  # COCO class for cell phone
            73: 'laptop',      # COCO class for laptop
            74: 'mouse',       # COCO class for mouse
            75: 'remote',      # COCO class for remote
            76: 'keyboard',    # COCO class for keyboard
            77: 'cell phone',  # Alternative cell phone class
            
            # Custom model classes (if using custom trained model)
            0: 'mobile_device',  # Custom model class 0
            1: 'phone',          # Custom model class 1
            2: 'tablet',         # Custom model class 2
        }
        
        # Classes to explicitly exclude (faces, people, etc.)
        excluded_classes = {
            0: 'person',        # COCO person class
            1: 'bicycle',       # COCO bicycle class
            2: 'car',           # COCO car class
            3: 'motorcycle',    # COCO motorcycle class
            4: 'airplane',      # COCO airplane class
            5: 'bus',           # COCO bus class
            6: 'train',         # COCO train class
            7: 'truck',         # COCO truck class
            15: 'bench',        # COCO bench class
            16: 'bird',         # COCO bird class
            17: 'cat',          # COCO cat class
            18: 'dog',          # COCO dog class
            19: 'horse',        # COCO horse class
            20: 'sheep',        # COCO sheep class
            21: 'cow',          # COCO cow class
            22: 'elephant',     # COCO elephant class
            23: 'bear',         # COCO bear class
            24: 'zebra',        # COCO zebra class
            25: 'giraffe',      # COCO giraffe class
            27: 'backpack',     # COCO backpack class
            28: 'umbrella',     # COCO umbrella class
            31: 'handbag',      # COCO handbag class
            32: 'tie',          # COCO tie class
            33: 'suitcase',     # COCO suitcase class
            34: 'frisbee',      # COCO frisbee class
            35: 'skis',         # COCO skis class
            36: 'snowboard',    # COCO snowboard class
            37: 'sports ball',  # COCO sports ball class
            38: 'kite',         # COCO kite class
            39: 'baseball bat', # COCO baseball bat class
            40: 'baseball glove', # COCO baseball glove class
            41: 'skateboard',   # COCO skateboard class
            42: 'surfboard',    # COCO surfboard class
            43: 'tennis racket', # COCO tennis racket class
            44: 'bottle',       # COCO bottle class
            46: 'wine glass',   # COCO wine glass class
            47: 'cup',          # COCO cup class
            48: 'fork',         # COCO fork class
            49: 'knife',        # COCO knife class
            50: 'spoon',        # COCO spoon class
            51: 'bowl',         # COCO bowl class
            52: 'banana',       # COCO banana class
            53: 'apple',        # COCO apple class
            54: 'sandwich',     # COCO sandwich class
            55: 'orange',       # COCO orange class
            56: 'broccoli',     # COCO broccoli class
            57: 'carrot',       # COCO carrot class
            58: 'hot dog',      # COCO hot dog class
            59: 'pizza',        # COCO pizza class
            60: 'donut',        # COCO donut class
            61: 'cake',         # COCO cake class
            62: 'chair',        # COCO chair class
            63: 'couch',        # COCO couch class
            64: 'potted plant', # COCO potted plant class
            65: 'bed',          # COCO bed class
            66: 'dining table', # COCO dining table class
            68: 'microwave',    # COCO microwave class
            69: 'oven',         # COCO oven class
            70: 'toaster',      # COCO toaster class
            71: 'sink',         # COCO sink class
            72: 'refrigerator', # COCO refrigerator class
        }
        
        for result in results:
            for box in result.boxes:
                conf = box.conf[0].item()
                cls = int(box.cls[0].item())
                
                # Skip low confidence detections
                if conf < 0.6:  # Increased threshold to reduce false positives
                    continue
                
                # Skip excluded classes (faces, people, etc.)
                if cls in excluded_classes:
                    logger.info(f"Skipping excluded class {cls} ({excluded_classes[cls]}) with confidence {conf:.3f}")
                    continue
                
                # Check if this is a mobile device class
                is_mobile = cls in mobile_classes
                
                if is_mobile:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    area = (x2 - x1) * (y2 - y1)
                    
                    # Additional size filtering to avoid small false positives
                    frame_area = frame.shape[0] * frame.shape[1]
                    area_ratio = area / frame_area
                    
                    # Only consider detections that are reasonably sized
                    if area_ratio > 0.001 and area_ratio < 0.5:  # Between 0.1% and 50% of frame
                        mobile_detected = True
                        max_confidence = max(max_confidence, conf)
                        
                        detections.append({
                            'confidence': conf,
                            'bbox': [x1, y1, x2, y2],
                            'area': area,
                            'center': [(x1 + x2) // 2, (y1 + y2) // 2],
                            'class': cls,
                            'class_name': mobile_classes.get(cls, f'class_{cls}'),
                            'area_ratio': area_ratio
                        })
                        
                        logger.info(f"Mobile device detected: class {cls} ({mobile_classes.get(cls, f'class_{cls}')}) "
                                  f"with confidence {conf:.3f}, area ratio {area_ratio:.3f}")
                    else:
                        logger.info(f"Skipping mobile class {cls} due to size: area ratio {area_ratio:.3f}")
                else:
                    logger.info(f"Skipping non-mobile class {cls} with confidence {conf:.3f}")
        
        # Log detection results
        logger.info(f"Detection completed: mobile_detected={mobile_detected}, "
                   f"detections={len(detections)}, max_confidence={max_confidence:.3f}")
        
        return jsonify({
            'mobile_detected': mobile_detected,
            'detections': detections,
            'confidence': max_confidence,
            'total_detections': len(detections),
            'timestamp': int(np.datetime64('now').astype(np.int64) / 1e6)
        })
        
    except Exception as e:
        logger.error(f"Detection error: {e}")
        return jsonify({
            'error': str(e),
            'mobile_detected': False,
            'confidence': 0
        }), 500

@app.route('/api/debug-detection', methods=['POST'])
def debug_detection():
    """Debug endpoint to show all detected classes"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'error': 'Model not loaded',
                'all_detections': []
            }), 500
        
        # Get image data from request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({
                'error': 'No image data provided',
                'all_detections': []
            }), 400
        
        image_data = data['image']
        
        # Decode base64 image
        try:
            # Remove data URL prefix if present
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                return jsonify({
                    'error': 'Invalid image data',
                    'all_detections': []
                }), 400
                
        except Exception as e:
            logger.error(f"Error decoding image: {e}")
            return jsonify({
                'error': 'Invalid image format',
                'all_detections': []
            }), 400
        
        # Run YOLO detection
        results = model(frame, verbose=False)
        all_detections = []
        
        # COCO class names for reference
        coco_classes = {
            0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane', 5: 'bus',
            6: 'train', 7: 'truck', 8: 'boat', 9: 'traffic light', 10: 'fire hydrant',
            11: 'stop sign', 12: 'parking meter', 13: 'bench', 14: 'bird', 15: 'cat',
            16: 'dog', 17: 'horse', 18: 'sheep', 19: 'cow', 20: 'elephant',
            21: 'bear', 22: 'zebra', 23: 'giraffe', 24: 'backpack', 25: 'umbrella',
            26: 'handbag', 27: 'tie', 28: 'suitcase', 29: 'frisbee', 30: 'skis',
            31: 'snowboard', 32: 'sports ball', 33: 'kite', 34: 'baseball bat',
            35: 'baseball glove', 36: 'skateboard', 37: 'surfboard', 38: 'tennis racket',
            39: 'bottle', 40: 'wine glass', 41: 'cup', 42: 'fork', 43: 'knife',
            44: 'spoon', 45: 'bowl', 46: 'banana', 47: 'apple', 48: 'sandwich',
            49: 'orange', 50: 'broccoli', 51: 'carrot', 52: 'hot dog', 53: 'pizza',
            54: 'donut', 55: 'cake', 56: 'chair', 57: 'couch', 58: 'potted plant',
            59: 'bed', 60: 'dining table', 61: 'toilet', 62: 'tv', 63: 'laptop',
            64: 'mouse', 65: 'remote', 66: 'keyboard', 67: 'cell phone', 68: 'microwave',
            69: 'oven', 70: 'toaster', 71: 'sink', 72: 'refrigerator', 73: 'book',
            74: 'clock', 75: 'vase', 76: 'scissors', 77: 'teddy bear', 78: 'hair drier',
            79: 'toothbrush'
        }
        
        for result in results:
            for box in result.boxes:
                conf = box.conf[0].item()
                cls = int(box.cls[0].item())
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                area = (x2 - x1) * (y2 - y1)
                frame_area = frame.shape[0] * frame.shape[1]
                area_ratio = area / frame_area
                
                class_name = coco_classes.get(cls, f'unknown_class_{cls}')
                
                all_detections.append({
                    'class_id': cls,
                    'class_name': class_name,
                    'confidence': conf,
                    'bbox': [x1, y1, x2, y2],
                    'area': area,
                    'area_ratio': area_ratio,
                    'center': [(x1 + x2) // 2, (y1 + y2) // 2]
                })
        
        # Sort by confidence
        all_detections.sort(key=lambda x: x['confidence'], reverse=True)
        
        return jsonify({
            'all_detections': all_detections,
            'total_detections': len(all_detections),
            'frame_size': [frame.shape[1], frame.shape[0]],  # width, height
            'timestamp': int(np.datetime64('now').astype(np.int64) / 1e6)
        })
        
    except Exception as e:
        logger.error(f"Debug detection error: {e}")
        return jsonify({
            'error': str(e),
            'all_detections': []
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': int(np.datetime64('now').astype(np.int64) / 1e6)
    })

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    if model is None:
        return jsonify({
            'error': 'Model not loaded',
            'model_path': 'models/best.pt'
        }), 500
    
    return jsonify({
        'model_loaded': True,
        'model_path': 'models/best.pt',
        'model_type': 'YOLO',
        'device': str(model.device)
    })

if __name__ == '__main__':
    # Load model on startup
    if load_model():
        logger.info("Starting mobile detection API server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        logger.error("Failed to load model. Server not started.")
        exit(1) 