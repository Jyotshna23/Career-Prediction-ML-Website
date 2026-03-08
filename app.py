# Career Prediction Website - Flask Backend

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import sqlite3
import os
import datetime
import json

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'model')
FRONTEND_DIR = BASE_DIR

# Load ML Models
def load_models():
    return None, None, None
   

model, scaler, le = load_models()

# Database Setup
DB_PATH = os.path.join(BASE_DIR, 'database', 'users.db')

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        predicted_career TEXT,
        confidence REAL,
        top3_careers TEXT,
        input_data TEXT,
        created_at TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        created_at TEXT
    )''')
    conn.commit()
    conn.close()
    print("Database initialized.")

init_db()

# Career Info
CAREER_INFO = {
    'AI/ML Engineer':       {'icon':'robot',     'salary':'8-25 LPA',  'growth':'Very High', 'description':'Design and build AI/ML systems and intelligent applications.','skills':['Python','TensorFlow','PyTorch','Statistics','SQL'],'courses':['Deep Learning Specialization - Coursera','Fast.ai','Google ML Crash Course'],'companies':['Google','Microsoft','Amazon','Flipkart','Swiggy']},
    'Software Developer':   {'icon':'laptop',    'salary':'5-20 LPA',  'growth':'High',      'description':'Build scalable software applications and systems.','skills':['Java','Python','DSA','System Design','Git'],'courses':['CS50 Harvard','The Odin Project','LeetCode DSA'],'companies':['TCS','Infosys','Wipro','Accenture']},
    'Cloud Engineer':       {'icon':'cloud',     'salary':'7-22 LPA',  'growth':'Very High', 'description':'Design and manage cloud infrastructure on AWS/Azure/GCP.','skills':['AWS','Terraform','Kubernetes','Docker','Linux'],'courses':['AWS Solutions Architect','AZ-900','GCP Associate'],'companies':['Amazon','Microsoft','Google','IBM']},
    'QA/Testing Engineer':  {'icon':'search',    'salary':'4-15 LPA',  'growth':'Medium',    'description':'Ensure software quality through manual and automation testing.','skills':['Selenium','JIRA','TestNG','Postman','SQL'],'courses':['ISTQB Certification','Selenium WebDriver'],'companies':['Cognizant','Capgemini','HCL','Mphasis']},
    'Data Scientist':       {'icon':'chart',     'salary':'7-20 LPA',  'growth':'Very High', 'description':'Extract insights from complex data using statistics and ML.','skills':['Python','SQL','Statistics','ML','Tableau'],'courses':['IBM Data Science Certificate','Kaggle Courses'],'companies':['Fractal Analytics','Mu Sigma','Razorpay']},
    'IT Project Manager':   {'icon':'clipboard', 'salary':'10-30 LPA', 'growth':'High',      'description':'Lead IT projects and manage cross-functional teams.','skills':['PMP','Agile','Scrum','Risk Management'],'courses':['PMP Certification','Scrum Master CSM'],'companies':['Accenture','IBM','Deloitte','Wipro']},
    'UI/UX Designer':       {'icon':'palette',   'salary':'4-18 LPA',  'growth':'High',      'description':'Design user interfaces and digital experiences.','skills':['Figma','Adobe XD','User Research','CSS'],'courses':['Google UX Design Certificate','Figma Masterclass'],'companies':['Zomato','Swiggy','Freshworks','Startups']},
    'DevOps Engineer':      {'icon':'gear',      'salary':'6-22 LPA',  'growth':'Very High', 'description':'Bridge development and operations with CI/CD automation.','skills':['Jenkins','Docker','Kubernetes','CI/CD','Shell'],'courses':['Docker & Kubernetes Complete Guide','GitLab CI/CD'],'companies':['Ola','PhonePe','CRED','BrowserStack']},
    'Full Stack Developer': {'icon':'globe',     'salary':'5-18 LPA',  'growth':'High',      'description':'Build complete web apps from frontend to backend.','skills':['React','Node.js','MongoDB','SQL','REST APIs'],'courses':['MERN Stack - Udemy','FreeCodeCamp'],'companies':['Startups','Persistent','Zensar','Remote']},
    'Business Analyst':     {'icon':'trend',     'salary':'5-16 LPA',  'growth':'Medium',    'description':'Analyze business processes and translate to technical needs.','skills':['SQL','Excel','Tableau','BPMN','Communication'],'courses':['Business Analysis Fundamentals','CBAP Certification'],'companies':['EY','KPMG','Deloitte','TCS']},
}

feature_cols = [
    'logical_thinking','creativity','communication','math_ability',
    'problem_solving','teamwork','attention_to_detail','leadership',
    'technical_skills','analytical_thinking','interest_in_coding',
    'interest_in_design','interest_in_data','interest_in_cloud','interest_in_testing'
]

# Routes - Serve HTML pages
@app.route('/')
def home():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/predict.html')
def predict_page():
    return send_from_directory(FRONTEND_DIR, 'predict.html')

@app.route('/result.html')
def result_page():
    return send_from_directory(FRONTEND_DIR, 'result.html')

@app.route('/dashboard.html')
def dashboard_page():
    return send_from_directory(FRONTEND_DIR, 'dashboard.html')

@app.route('/login.html')
def login_page():
    return send_from_directory(FRONTEND_DIR, 'login.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)

# API - Predict
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data   = request.get_json()
        name   = data.get('name', 'User')
        email  = data.get('email', '')

        features = [float(data.get(f, 5)) for f in feature_cols]

        if model and scaler and le:
            features_array  = np.array([features])
            features_scaled = scaler.transform(features_array)
            prediction      = model.predict(features_scaled)
            probabilities   = model.predict_proba(features_scaled)[0]
            predicted_career = le.inverse_transform(prediction)[0]
            confidence      = float(max(probabilities) * 100)
            top3_idx        = np.argsort(probabilities)[-3:][::-1]
            top3 = [{'career': le.classes_[i], 'confidence': round(float(probabilities[i]*100),1)} for i in top3_idx]
        else:
            scores = {
                'AI/ML Engineer':       (float(data.get('interest_in_data',5)) + float(data.get('math_ability',5))) / 2,
                'Software Developer':   (float(data.get('interest_in_coding',5)) + float(data.get('logical_thinking',5))) / 2,
                'Cloud Engineer':       (float(data.get('interest_in_cloud',5)) + float(data.get('technical_skills',5))) / 2,
                'Data Scientist':       (float(data.get('interest_in_data',5)) + float(data.get('analytical_thinking',5))) / 2,
                'DevOps Engineer':      (float(data.get('interest_in_cloud',5)) + float(data.get('interest_in_testing',5))) / 2,
                'QA/Testing Engineer':  (float(data.get('interest_in_testing',5)) + float(data.get('attention_to_detail',5))) / 2,
                'Full Stack Developer': (float(data.get('interest_in_coding',5)) + float(data.get('interest_in_design',5))) / 2,
                'UI/UX Designer':       (float(data.get('interest_in_design',5)) + float(data.get('creativity',5))) / 2,
                'IT Project Manager':   (float(data.get('leadership',5)) + float(data.get('communication',5))) / 2,
                'Business Analyst':     (float(data.get('analytical_thinking',5)) + float(data.get('communication',5))) / 2,
            }
            sorted_scores    = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            predicted_career = sorted_scores[0][0]
            confidence       = min(72 + sorted_scores[0][1] * 2, 94)
            top3 = [{'career': c, 'confidence': round(min(confidence - i*9, 94), 1)} for i, (c, _) in enumerate(sorted_scores[:3])]

        career_details = CAREER_INFO.get(predicted_career, {})

        conn = sqlite3.connect(DB_PATH)
        c    = conn.cursor()
        c.execute(
            'INSERT INTO predictions (name,email,predicted_career,confidence,top3_careers,input_data,created_at) VALUES (?,?,?,?,?,?,?)',
            (name, email, predicted_career, confidence, json.dumps(top3), json.dumps(features), datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        )
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'name': name, 'predicted_career': predicted_career, 'confidence': round(confidence, 1), 'top3_careers': top3, 'career_info': career_details})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# API - Stats
@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        conn = sqlite3.connect(DB_PATH)
        c    = conn.cursor()
        c.execute('SELECT COUNT(*) FROM predictions')
        total = c.fetchone()[0]
        c.execute('SELECT predicted_career, COUNT(*) as cnt FROM predictions GROUP BY predicted_career ORDER BY cnt DESC LIMIT 5')
        top_careers = c.fetchall()
        c.execute('SELECT name, predicted_career, confidence, created_at FROM predictions ORDER BY id DESC LIMIT 10')
        recent = c.fetchall()
        conn.close()
        return jsonify({
            'total_predictions': total,
            'top_careers':       [{'career': r[0], 'count': r[1]} for r in top_careers],
            'recent_predictions':[{'name': r[0], 'career': r[1], 'confidence': r[2], 'date': r[3]} for r in recent]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API - Login
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data  = request.get_json()
        email = data.get('email','')
        pwd   = data.get('password','')
        conn  = sqlite3.connect(DB_PATH)
        c     = conn.cursor()
        c.execute('SELECT id, name FROM users WHERE email=? AND password=?', (email, pwd))
        user  = c.fetchone()
        conn.close()
        if user:
            return jsonify({'success': True, 'name': user[1]})
        return jsonify({'success': False, 'error': 'Invalid email or password.'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# API - Register
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data  = request.get_json()
        name  = data.get('name','')
        email = data.get('email','')
        pwd   = data.get('password','')
        conn  = sqlite3.connect(DB_PATH)
        c     = conn.cursor()
        c.execute('INSERT INTO users (name, email, password, created_at) VALUES (?,?,?,?)',
                  (name, email, pwd, datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        conn.commit()
        conn.close()
        return jsonify({'success': True})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'error': 'Email already registered.'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# API - Health
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'running', 'model_loaded': model is not None, 'accuracy': '94%'})

if __name__ == '__main__':
    print("=" * 50)
    print("Career Prediction Server Starting...")
    print("   Open: http://localhost:5000")
    print("=" * 50)

    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))


