# from flask import Flask, request, jsonify
# from flask_cors import CORS, cross_origin
# from PIL import Image
# import base64
# from io import BytesIO
# import os
# import joblib
# import pandas as pd
# import cv2
# from pymongo import MongoClient
# import numpy as np
# from utils.feature_extraction import extract_features
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Initialize Flask app
# app = Flask(__name__)

# # Configure CORS with environment variables
# FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
# app.config['CORS_ORIGINS'] = [FRONTEND_URL]
# CORS(app, resources={r"/*": {"origins": app.config['CORS_ORIGINS']}})

# # Load the pre-trained model
# MODEL_PATH = os.path.join('models', 'random_forest_model.pkl')
# loaded_model = joblib.load(MODEL_PATH)

# # MongoDB connection with environment variables
# MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/SecQR')
# client = MongoClient(MONGODB_URI, tlsAllowInvalidCertificates=True)
# db = client[os.getenv('MONGODB_DB', 'SecQR')]

# def analyze_qr_code(image):
#     """Analyze QR code from image and return status and decoded data."""
#     detector = cv2.QRCodeDetector()
#     data, bbox, _ = detector.detectAndDecode(image)
#     if data and bbox is not None:
#         # Store original URL for return
#         original_url = data
        
#         # Normalize URL by adding scheme if missing
#         if not data.startswith('http://') and not data.startswith('https://'):
#             normalized_data = 'http://' + data
#         else:
#             normalized_data = data
        
#         # Check databases first (with both original and normalized URLs)
#         if does_safe_link_exist(original_url) or does_safe_link_exist(normalized_data):
#             return 'safe', original_url
            
#         if does_malicious_link_exist(original_url) or does_malicious_link_exist(normalized_data):
#             return 'malicious', original_url
            
#         # Extract features and make prediction only if not found in databases
#         features = extract_features(normalized_data)
#         prediction = loaded_model.predict(pd.DataFrame([features]))[0]
#         status = 'safe' if prediction == 0 else 'malicious'
#         return status, original_url
#     return 'safe', None


# # Database utility functions
# def does_safe_link_exist(url):
#     """Check if URL exists in safe links database."""
#     safe_collection = db['safeLinks']
#     return safe_collection.find_one({'url': url}) is not None

# def does_malicious_link_exist(url):
#     """Check if URL exists in malicious links database."""
#     malicious_collection = db['maliciousLinks']
#     return malicious_collection.find_one({'url': url}) is not None

# def add_link_if_not_exists(url, category):
#     """Add URL to appropriate database if it doesn't exist."""
#     collection = db['maliciousLinks'] if category == 'malicious' else db['safeLinks']
#     if not collection.find_one({'url': url}):
#         collection.insert_one({'url': url, 'category': category})
#         return True
#     return False

# # API Endpoints
# @app.route('/scan', methods=['POST'])
# @cross_origin()
# def scan_qr_code():
#     """Endpoint to receive and analyze QR code image."""
#     try:
#         data = request.json
#         if not data or 'image' not in data:
#             return jsonify({'status': 'error', 'message': 'No image provided'}), 400

#         # Decode the Base64 image
#         image_data = data['image'].replace('data:image/png;base64,', '')
#         image = Image.open(BytesIO(base64.b64decode(image_data)))

#         # Convert PIL image to OpenCV format
#         open_cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

#         # Analyze QR code
#         result, url = analyze_qr_code(open_cv_image)

#         if not url:
#             return jsonify({'status': 'error', 'message': 'No QR code detected'}), 200

#         return jsonify({'status': result, 'url': url}), 200

#     except Exception as e:
#         # Remove detailed error logging for production
#         return jsonify({'status': 'error', 'message': 'Error processing QR code'}), 500

# @app.route('/checksafe-url', methods=['POST'])
# def checksafe_url():
#     """Endpoint to check if URL exists in safe links database."""
#     data = request.json
#     url = data.get('url')
    
#     if url:
#         exists = does_safe_link_exist(url)
#         return jsonify({'exists': exists}), 200
#     return jsonify({'error': 'URL not provided'}), 400

# @app.route('/checkmalicious-url', methods=['POST'])
# def checkmalicious_url():
#     """Endpoint to check if URL exists in malicious links database."""
#     try:
#         data = request.json
#         if not data:
#             return jsonify({'error': 'No JSON data received'}), 400

#         url = data.get('url')
#         if not url:
#             return jsonify({'error': 'URL field is missing in the JSON data'}), 400

#         exists = does_malicious_link_exist(url)
#         return jsonify({'exists': exists}), 200

#     except Exception:
#         # Remove detailed error logging for production
#         return jsonify({'error': 'Error processing request'}), 500

# @app.route('/report-url', methods=['POST'])
# def report_url():
#     """Endpoint to report a URL as malicious."""
#     data = request.json
#     url = data.get('url')
    
#     if url:
#         added = add_link_if_not_exists(url, 'malicious')
#         if added:
#             return jsonify({'message': 'URL reported as malicious successfully'}), 200
#         return jsonify({'message': 'URL already exists in database'}), 200
    
#     return jsonify({'error': 'URL not provided'}), 400

# # Health check endpoint for deployment platforms
# @app.route('/health', methods=['GET'])
# def health_check():
#     """Simple health check endpoint."""
#     return jsonify({'status': 'healthy'}), 200

# if __name__ == '__main__':
#     # Get port from environment variable for deployment platforms
#     port = int(os.getenv('PORT', 5000))
#     app.run(host="0.0.0.0", port=port, debug=False)

import base64
import json
import os
import traceback
import uuid
from io import BytesIO
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import cv2
import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from urllib.parse import urlparse

from url_security_service import (
    analyze_url_security,
    google_web_risk_lookup,
    normalize_url,
    openphish_lookup,
    phishtank_lookup,
    rdap_domain_age,
    run_gemini_research,
    safe_page_analysis,
    validate_url_for_fetch,
)
from utils.feature_extraction import extract_features

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

MODEL_PATH = os.path.join(BASE_DIR, 'models', 'random_forest_model.pkl')
loaded_model = joblib.load(MODEL_PATH)


def _int_prediction_value(prediction):
    if prediction is None:
        return 0
    if isinstance(prediction, (int, float, np.integer, np.floating)):
        return 1 if float(prediction) > 0 else 0
    if isinstance(prediction, str):
        lowered = prediction.strip().lower()
        if lowered in {'malicious', 'suspicious', 'unsafe', '1', 'true'}:
            return 1
        return 0
    return 1 if bool(prediction) else 0


def get_ml_prediction(url):
    normalized_url = normalize_url(url)
    features = extract_features(normalized_url)
    prediction = loaded_model.predict(pd.DataFrame([features]))[0]
    value = _int_prediction_value(prediction)

    confidence = 0.5
    if hasattr(loaded_model, 'predict_proba'):
        probabilities = loaded_model.predict_proba(pd.DataFrame([features]))[0]
        confidence = float(max(probabilities)) if len(probabilities) > 0 else 0.5

    label = 'Suspicious' if value == 1 else 'Normal'
    status = 'malicious' if value == 1 else 'safe'
    return {
        'status': status,
        'label': label,
        'confidence': round(confidence, 4),
        'raw_prediction': str(prediction),
    }


def build_analysis_result(url):
    normalized_url = normalize_url(url)
    parsed = urlparse(normalized_url)
    if not normalized_url or not parsed.scheme or not parsed.netloc:
        raise ValueError('Malformed or missing URL')

    security_features = analyze_url_security(normalized_url)
    ml_result = get_ml_prediction(normalized_url)
    domain_age = rdap_domain_age(parsed.hostname or '') if parsed.hostname else {'domain': '', 'registration_date': None, 'domain_age_days': None, 'domain_age_years': None, 'source': 'RDAP', 'status': 'unavailable'}
    security_features['domain_age'] = domain_age

    openphish = openphish_lookup(normalized_url)
    phishtank = phishtank_lookup(normalized_url)
    web_risk = google_web_risk_lookup(normalized_url)
    page_analysis = safe_page_analysis(normalized_url)

    security_features['redirect_count'] = page_analysis.get('redirect_count') if page_analysis.get('redirect_count') is not None else security_features.get('redirect_count')
    security_features['domain_reputation'] = {
        'status': 'suspicious' if openphish.get('found') or phishtank.get('in_database') or web_risk.get('threat_detected') else 'unknown',
        'source': 'OpenPhish / PhishTank / Google Web Risk',
    }

    external_intelligence = {
        'openphish': openphish,
        'phishtank': phishtank,
        'rdap': domain_age,
        'google_web_risk': web_risk,
        'website_analysis': page_analysis,
    }

    gemini_payload = {
        'basic': {
            'domain': parsed.hostname or '',
            'protocol': parsed.scheme.lower() or 'unknown',
            'url_length': len(normalized_url),
            'path_depth': security_features['path_depth'],
        },
        'security_features': security_features,
        'ml_prediction': ml_result,
        'website_analysis': page_analysis,
        'threat_intelligence': external_intelligence,
    }
    gemini_analysis = run_gemini_research(normalized_url, gemini_payload)

    suspicious_score = bool(
        ml_result.get('status') == 'malicious'
        or openphish.get('found')
        or phishtank.get('in_database')
        or web_risk.get('threat_detected')
    )

    analysis = {
        'url': normalized_url,
        'status': 'malicious' if suspicious_score else 'safe',
        'ml_status': ml_result['status'],
        'ml_prediction': {
            'label': ml_result['label'],
            'confidence': ml_result['confidence'],
        },
        'basic': {
            'domain': (parsed.hostname or ''),
            'protocol': parsed.scheme.lower() or 'unknown',
            'url_length': len(normalized_url),
            'path_depth': security_features['path_depth'],
        },
        'security_features': security_features,
        'external_intelligence': external_intelligence,
        'gemini_analysis': gemini_analysis,
        'gemini': gemini_analysis,
    }
    return analysis


def analyze_qr_code(image):
    detector = cv2.QRCodeDetector()
    data, bbox, _ = detector.detectAndDecode(image)
    if data and bbox is not None:
        original_url = data.strip()
        return build_analysis_result(original_url)
    return {'status': 'error', 'message': 'No QR code detected', 'url': None}


@app.route('/scan', methods=['POST'])
def scan_qr_code():
    try:
        payload = request.get_json(silent=True) or {}
        image_value = payload.get('image')
        if not image_value:
            return jsonify({'status': 'error', 'message': 'No image provided'}), 400

        image_data = image_value
        if image_data.startswith('data:image'):
            image_data = image_data.split(',', 1)[1]
        padding = len(image_data) % 4
        if padding:
            image_data += '=' * (4 - padding)

        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(BytesIO(image_bytes))
            cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        except Exception as exc:
            app.logger.error(f'Image decoding error: {exc}')
            return jsonify({'status': 'error', 'message': 'Invalid image format'}), 400

        result = analyze_qr_code(cv_image)
        if result.get('url') is None:
            return jsonify({'status': 'error', 'message': 'No QR code detected'}), 200
        return jsonify(result), 200
    except Exception as exc:
        app.logger.error(f'Error in /scan: {exc}')
        app.logger.error(traceback.format_exc())
        return jsonify({'status': 'error', 'message': 'Error processing QR code'}), 500


@app.route('/extract-qr', methods=['POST'])
def extract_qr_data():
    data = request.get_json(silent=True) or {}
    image_data = data.get('image')
    if not image_data:
        return jsonify({'status': 'error', 'message': 'No image provided'}), 400

    try:
        payload = json.dumps({'image': image_data}).encode('utf-8')
        request_obj = Request(
            'https://quickchart.io/qr-read',
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST',
        )
        with urlopen(request_obj, timeout=15) as response:
            quickchart_data = json.loads(response.read().decode('utf-8'))
        result = str(quickchart_data.get('result', '')).strip()
        if result:
            return jsonify({'status': 'success', 'result': result}), 200
        raise ValueError('QuickChart returned no QR data')
    except Exception as quickchart_error:
        app.logger.warning(f'QuickChart QR extraction failed: {quickchart_error}')

    try:
        image_bytes = base64.b64decode(image_data)
        boundary = f'----QRGuard{uuid.uuid4().hex}'
        multipart_body = (
            f'--{boundary}\r\n'
            'Content-Disposition: form-data; name="file"; filename="qr-image.png"\r\n'
            'Content-Type: image/png\r\n\r\n'
        ).encode('utf-8') + image_bytes + f'\r\n--{boundary}--\r\n'.encode('utf-8')

        qrserver_request = Request(
            'https://api.qrserver.com/v1/read-qr-code/?outputformat=json',
            data=multipart_body,
            headers={'Content-Type': f'multipart/form-data; boundary={boundary}'},
            method='POST',
        )
        with urlopen(qrserver_request, timeout=15) as response:
            qrserver_data = json.loads(response.read().decode('utf-8'))

        symbol = qrserver_data[0]['symbol'][0]
        result = (symbol.get('data') or '').strip()
        if result:
            return jsonify({'status': 'success', 'result': result}), 200

        return jsonify({'status': 'error', 'message': symbol.get('error') or 'No QR code was found in this image'}), 422
    except Exception as qrserver_error:
        app.logger.error(f'QRServer QR extraction failed: {qrserver_error}')
        return jsonify({'status': 'error', 'message': 'QR extraction failed with both services'}), 502


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200


@app.route('/analyze-url', methods=['POST'])
def analyze_url():
    try:
        payload = request.get_json(silent=True) or {}
        if 'url' not in payload:
            return jsonify({'status': 'error', 'message': 'No URL provided'}), 400

        original_url = str(payload.get('url', '')).strip()
        if not original_url:
            return jsonify({'status': 'error', 'message': 'URL cannot be empty'}), 400

        try:
            analysis = build_analysis_result(original_url)
        except ValueError as exc:
            return jsonify({'status': 'error', 'message': str(exc)}), 400

        return jsonify(analysis), 200
    except Exception as exc:
        app.logger.error(f'Error in /analyze-url: {exc}')
        app.logger.error(traceback.format_exc())
        return jsonify({'status': 'error', 'message': 'Error analyzing URL'}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
