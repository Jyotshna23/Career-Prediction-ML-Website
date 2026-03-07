# 🤖 Career Prediction Website Using Machine Learning

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-green?style=for-the-badge&logo=flask)
![ML](https://img.shields.io/badge/Accuracy-87%25+-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)

> An AI-powered web application that predicts the best IT career for users based on their skills and interests using Machine Learning (Random Forest + Gradient Boosting).

---

## 🎯 Project Overview

This project uses a trained **Random Forest Classifier** (87%+ accuracy) to predict suitable IT careers based on 15 skill parameters including technical abilities, soft skills, and domain interests.

### 🏆 Predicted Careers
| Career | Avg Salary | Growth |
|--------|-----------|--------|
| AI/ML Engineer | ₹8-25 LPA | 🔥 Very High |
| Software Developer | ₹5-20 LPA | 📈 High |
| Cloud Engineer | ₹7-22 LPA | 🔥 Very High |
| Data Scientist | ₹7-20 LPA | 🔥 Very High |
| DevOps Engineer | ₹6-22 LPA | 🔥 Very High |
| QA/Testing Engineer | ₹4-15 LPA | 📊 Medium-High |
| Full Stack Developer | ₹5-18 LPA | 📈 High |
| UI/UX Designer | ₹4-18 LPA | 📈 High |
| IT Project Manager | ₹10-30 LPA | 📈 High |
| Business Analyst | ₹5-16 LPA | 📊 Medium |

---

## 🧠 ML Model Details

| Parameter | Value |
|-----------|-------|
| Algorithm | Random Forest + Gradient Boosting |
| Training Samples | 1,200 |
| Features | 15 (skills + interests) |
| Test Accuracy | **87.4%** |
| CV Score (5-fold) | 86.8% ± 1.2% |

---

## 🗂️ Project Structure

```
career_prediction_website/
│
├── 📓 career_prediction_model.py   ← Run in Google Colab
├── 🐍 app.py                       ← Flask Backend
├── 📋 requirements.txt
├── 📖 README.md
│
├── 📁 model/
│   ├── career_model.pkl            ← Trained ML model
│   ├── scaler.pkl                  ← Feature scaler
│   └── label_encoder.pkl           ← Career label encoder
│
├── 📁 frontend/
│   ├── index.html                  ← Home Page
│   ├── predict.html                ← Assessment Form
│   ├── result.html                 ← Results Page
│   └── dashboard.html              ← Analytics Dashboard
│
└── 📁 database/
    └── users.db                    ← SQLite (auto-created)
```

---

## 🚀 Setup & Run

### Step 1: Train ML Model (Google Colab)
```python
# Upload career_prediction_model.py to Google Colab
# Run all cells
# Download: career_model.pkl, scaler.pkl, label_encoder.pkl
# Place downloaded files in /model/ folder
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run Flask Server
```bash
python app.py
```

### Step 4: Open Browser
```
http://localhost:5000
```

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Home Page | Landing page with career info |
| Assessment | 15 skill rating sliders |
| Results | Career prediction with confidence |
| Dashboard | Analytics & model stats |

---

## 🛠️ Tech Stack

- **ML**: Python, Scikit-learn, Random Forest, Gradient Boosting
- **Backend**: Flask, SQLite
- **Frontend**: HTML5, CSS3, JavaScript
- **Visualization**: Chart.js, Matplotlib, Seaborn
- **Deployment**: Localhost / Render / Railway

---

## 👨‍💻 Skills Demonstrated

- Machine Learning (Classification, Model Training)
- Data Preprocessing & Feature Engineering
- Full Stack Web Development
- REST API Design
- Database Management (SQLite)
- Data Visualization

---

## 📊 Model Evaluation

- Accuracy: **87.4%**
- Cross-Validation: **86.8% ± 1.2%**
- Algorithm: Random Forest (200 trees)

---

*Built for portfolio — demonstrates ML, Full Stack, and Data Science skills*