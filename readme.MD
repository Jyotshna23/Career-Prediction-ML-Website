<div align="center">

# 🎯 CareerPath AI — ML-Powered Career Guidance System

**An end-to-end Machine Learning web application that evaluates 15 cognitive, technical, and domain-interest traits to predict the best-fit IT career path with confidence probabilities and actionable learning roadmaps.**

![Python](https://shields.io)
![Flask](https://shields.io)
![Scikit-learn](https://shields.io)
![SQLite](https://shields.io)
![Accuracy](https://shields.io)

</div>

---

## 🚨 Overview & Problem Statement

Students and early-career professionals often struggle to choose between specialized technology tracks—such as **AI/ML Engineering**, **Cloud Engineering**, **Full Stack Development**, **QA Automation**, or **DevOps**—without data-driven insight into how their strengths align with industry demands. 

**CareerPath AI** solves this by combining a **94% accurate soft-voting ensemble classifier** (`Random Forest` + `Gradient Boosting`) with a full-stack **Flask & SQLite** platform to deliver probability-ranked career recommendations, salary benchmarks, curated courses, and top hiring companies.

---

## ✨ Key Capabilities

* 🧠 **15-Parameter Trait Assessment:** Evaluates 15 standardized inputs covering cognitive skills (*logical thinking, math ability, analytical thinking*), soft skills (*communication, leadership, teamwork*), and domain interests (*coding, cloud, data, design, testing*).
* 📊 **Soft-Voting Ensemble with Confidence Ranking:** Uses `predict_proba` across a `VotingClassifier` to rank the **Top 3 best-fit IT roles** with exact confidence percentages.
* 🛡️ **Zero-Downtime Fallback Engine:** Includes an automated weighted-scoring fallback mechanism in `app.py` if serialized `.pkl` artifacts are unavailable, ensuring uninterrupted service.
* 🗺️ **Actionable Career Roadmaps:** Enriches every prediction with compensation bands (LPA), market growth outlook, required tech stacks, recommended courses, and target employers across **10 IT career tracks**.
* 🔐 **User Accounts, Analytics & PDF Reports:** Features user registration/login, persistent prediction history in **SQLite**, real-time aggregate analytics on `/dashboard.html`, and printable PDF reports (`Output_result.pdf`).

---

## 🏗️ System Architecture & ML Pipeline

```text
  [Frontend UI: predict.html] ──► User submits 15 skill & interest ratings (1–10)
               │
               ▼
  [Flask REST API: POST /api/predict]
               │
               ├──► 1. Feature Normalization ──► StandardScaler (scaler.pkl)
               ├──► 2. Ensemble Inference    ──► VotingClassifier: RF (w=2) + GB (w=1)
               ├──► 3. Class Decoding        ──► LabelEncoder (label_encoder.pkl)
               ├──► 4. Roadmap Enrichment    ──► Salary, Skills, Courses & Employers
               └──► 5. Data Persistence      ──► SQLite3 (database/users.db)
               │
               ▼
  [Result & Analytics: result.html / dashboard.html] ──► Top-3 matches & live stats
```

### 🔬 Model Specifications
* **Algorithm:** `VotingClassifier` (Soft Voting — Random Forest `weight=2`, Gradient Boosting `weight=1`)
* **Dataset & Validation:** 2,000 samples | 10 target classes | 15 input features | 5-fold Stratified Cross-Validation
* **Test Accuracy:** **94%**

---

## 🎯 Supported Career Tracks (10 Roles)

| Career Track | Salary Range | Growth Outlook | Core Technical Skills |
| :--- | :--- | :--- | :--- |
| 🤖 **AI/ML Engineer** | 8–25 LPA | Very High | Python, TensorFlow, PyTorch, Statistics, SQL |
| ☁️ **Cloud Engineer** | 7–22 LPA | Very High | AWS, Terraform, Kubernetes, Docker, Linux |
| 📊 **Data Scientist** | 7–20 LPA | Very High | Python, SQL, Statistics, Machine Learning, Tableau |
| ⚙️ **DevOps Engineer** | 6–22 LPA | Very High | Jenkins, Docker, Kubernetes, CI/CD, Shell |
| 📋 **IT Project Manager** | 10–30 LPA | High | PMP, Agile, Scrum, Risk Management |
| 💻 **Software Developer** | 5–20 LPA | High | Java, Python, DSA, System Design, Git |
| 🌐 **Full Stack Developer** | 5–18 LPA | High | React, Node.js, MongoDB, SQL, REST APIs |
| 🎨 **UI/UX Designer** | 4–18 LPA | High | Figma, Adobe XD, User Research, CSS |
| 📈 **Business Analyst** | 5–16 LPA | Medium | SQL, Excel, Tableau, BPMN, Communication |
| 🔍 **QA/Testing Engineer** | 4–15 LPA | Medium | Selenium, JIRA, TestNG, Postman, SQL |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Machine Learning** | Scikit-learn (`1.6.1`), NumPy (`1.26.4`), Pandas (`2.2.3`) | Ensemble training, feature scaling, and probability inference |
| **Backend & API** | Python (`3.10+`), Flask (`3.0.3`), Flask-CORS (`4.0.1`), Gunicorn | RESTful endpoints, ML model serving, and static file routing |
| **Database** | SQLite3 | Relational storage for registered users and prediction history |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (`main.js`) | Interactive 15-trait quiz, dynamic result cards, and charts |

---

## 🔌 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Serves the main landing page (`index.html`) |
| `GET` | `/predict.html` | Serves the 15-parameter skill assessment form |
| `POST` | `/api/predict` | Runs ML inference, stores the record, and returns Top-3 careers + roadmap |
| `GET` | `/api/stats` | Returns total predictions, top career distribution, and 10 most recent runs |
| `POST` | `/api/register` | Creates a new user account with duplicate-email validation |
| `POST` | `/api/login` | Authenticates user credentials against SQLite |
| `GET` | `/api/health` | Health-check endpoint reporting server status and loaded model state |

<details>
<summary><b>📄 View Sample JSON Request & Response (<code>POST /api/predict</code>)</b></summary>

**Request Payload:**
```json
{
  "name": "Jyotshna",
  "email": "jyotshna@example.com",
  "logical_thinking": 8,
  "creativity": 7,
  "communication": 8,
  "math_ability": 8,
  "problem_solving": 9,
  "teamwork": 8,
  "attention_to_detail": 7,
  "leadership": 7,
  "technical_skills": 9,
  "analytical_thinking": 8,
  "interest_in_coding": 9,
  "interest_in_design": 5,
  "interest_in_data": 8,
  "interest_in_cloud": 7,
  "interest_in_testing": 6
}
```

**Response Payload:**
```json
{
  "success": true,
  "name": "Jyotshna",
  "predicted_career": "AI/ML Engineer",
  "confidence": 82.0,
  "top3_careers": [
    { "career": "AI/ML Engineer", "confidence": 82.0 },
    { "career": "Software Developer", "confidence": 73.0 },
    { "career": "Cloud Engineer", "confidence": 64.0 }
  ],
  "career_details": {
    "icon": "🤖",
    "salary": "8-25 LPA",
    "growth": "Very High",
    "description": "Design and build AI/ML systems and intelligent applications.",
    "skills": ["Python", "TensorFlow", "PyTorch", "Statistics", "SQL"],
    "courses": ["Deep Learning Specialization - Coursera", "Fast.ai", "Google ML Crash Course"],
    "companies": ["Google", "Microsoft", "Amazon", "Flipkart", "Swiggy"]
  }
}
```
</details>

---

## 📂 Project Structure

```text
Career-Prediction-ML-Website/
├── app.py                  # Flask REST API, ML inference pipeline & SQLite logic
├── requirements.txt        # Pinned Python dependencies
├── runtime.txt             # Python runtime specification for deployment
├── Output_result.pdf       # Sample generated career prediction report
├── index.html              # Home & landing page
├── login.html              # User login & registration page
├── predict.html            # 15-trait interactive skill assessment form
├── result.html             # Top-3 career match & roadmap display
├── dashboard.html          # Live prediction analytics & history table
├── style.css               # Global responsive styling
├── main.js                 # Frontend API integration & UI logic
├── database/
│   └── users.db            # Auto-initialized SQLite database
└── model/
    ├── model.pkl           # Trained VotingClassifier ensemble model
    ├── scaler.pkl          # Fitted StandardScaler
    └── label_encoder.pkl   # Fitted LabelEncoder
```

---

## 🚀 Getting Started

### Prerequisites
* **Python 3.10+**
* `pip` package manager

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jyotshna23/Career-Prediction-ML-Website.git
   cd Career-Prediction-ML-Website
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask server**
   ```bash
   python app.py
   ```
   The SQLite database (`database/users.db`) initializes automatically on startup. Open `http://localhost:5000` in your browser to explore the application.

---

## 📄 Sample Output

View [Output_result.pdf](Output_result.pdf) to inspect a complete sample prediction and career roadmap report.

---

## 👩‍💻 Author

**Jyotshna Pogiri** — Python & GenAI Developer
* **GitHub:** [github.com/Jyotshna23](https://github.com/Jyotshna23)
* **LinkedIn:** [://linkedin.com](https://www.://linkedin.com)
* **Email:** [jahnavipogiri3@gmail.com](mailto:jahnavipogiri3@gmail.com)
