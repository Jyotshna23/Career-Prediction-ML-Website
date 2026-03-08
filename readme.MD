# Career Prediction Website — ML-Powered Career Guidance System

A machine learning web application that predicts the most suitable IT career path based on a user's skill profile. Built with Python, Flask, and Scikit-learn using an ensemble of Random Forest and Gradient Boosting classifiers.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-black?style=flat-square&logo=flask)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.3-orange?style=flat-square&logo=scikit-learn)
![Accuracy](https://img.shields.io/badge/Accuracy-94%25-brightgreen?style=flat-square)
![Status](https://img.shields.io/badge/Status-Live-success?style=flat-square)

---

## Overview

CareerAI analyzes 15 skill parameters — including logical thinking, technical skills, creativity, and domain interests — and recommends the best-fit IT role from 10 career categories. It provides confidence scores, salary ranges, recommended courses, and top hiring companies for each prediction.

---

## Features

- Skill-based assessment across 15 parameters
- ML ensemble model (Random Forest + Gradient Boosting) with 94% accuracy
- Top 3 career matches with confidence percentages
- Salary range, key skills, recommended courses, and hiring companies per role
- Prediction history dashboard with SQLite storage
- Printable PDF result output

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| ML Model | Scikit-learn, Random Forest, Gradient Boosting |
| Backend | Python, Flask, Flask-CORS |
| Database | SQLite |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Training | Google Colab |

---

## ML Model — How It Works

1. **Input** — User rates 15 skills on a scale of 1–10
2. **Preprocessing** — StandardScaler normalizes the input
3. **Prediction** — VotingClassifier (RF weight=2, GB weight=1) with soft voting
4. **Output** — Predicted career + top 3 matches with confidence scores

**Careers Supported:**
AI/ML Engineer, Software Developer, Cloud Engineer, Data Scientist, Cybersecurity Analyst, DevOps Engineer, UI/UX Designer, Database Administrator, Network Engineer, QA Test Engineer

**Training Data:** 2,000 samples | 10 classes | 5-fold Stratified Cross-Validation

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home page |
| GET | `/predict.html` | Skill assessment form |
| POST | `/api/predict` | Run ML prediction |
| GET | `/api/stats` | Dashboard statistics |
| POST | `/api/register` | User registration |
| POST | `/api/login` | User login |

**Sample Request — `/api/predict`:**
```json
{
  "name": "Jyotshna",
  "logical_thinking": 8,
  "creativity": 7,
  "technical_skills": 9,
  "interest_in_coding": 9,
  "interest_in_data": 8
}
```

**Sample Response:**
```json
{
  "predicted_career": "AI/ML Engineer",
  "confidence": 82.0,
  "top3_careers": [
    ["AI/ML Engineer", 82.0],
    ["Software Developer", 73.0],
    ["Cloud Engineer", 64.0]
  ],
  "salary_range": "8-25 LPA"
}
```

---

## Project Structure

```
career-prediction-website/
├── app.py                  # Flask backend + API routes
├── requirements.txt        # Python dependencies
├── .gitignore
├── frontend/
│   ├── index.html          # Landing page
│   ├── predict.html        # Skill assessment form
│   ├── result.html         # Prediction results
│   ├── dashboard.html      # Prediction history
│   ├── login.html          # User authentication
│   ├── style.css           # Global styles
│   └── main.js             # Frontend logic
└── model/
    ├── career_model.pkl    # Trained ensemble model
    ├── scaler.pkl          # StandardScaler
    ├── label_encoder.pkl   # LabelEncoder
    └── feature_names.pkl   # Feature column names
```

---

## Setup and Installation

```bash
# Clone the repository
git clone https://github.com/Jyotshna23/Career-Prediction-ML-Website.git
cd Career-Prediction-ML-Website

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py

# Open in browser
http://localhost:5000
```

---

## Output

See [output_result.pdf](output_result.pdf) for a sample prediction result.

---

## Author

**Jyotshna Pogiri**
- GitHub: [Jyotshna23](https://github.com/Jyotshna23)
