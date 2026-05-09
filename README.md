# EcoSmart-AI

An AI-powered environmental monitoring and waste management system that helps users analyze waste disposal methods, predict environmental risks, and promote sustainable practices using Machine Learning and Data Science.

---

## Live Demo

### Frontend
https://ecosmart-ai-shreyaanchavan.netlify.app/

### Backend API
https://ecosmart-ai.onrender.com/

---

# Features

##  Noise Pollution Prediction
- Predicts environmental health risk based on:
  - Noise level
  - Traffic density
  - Area type
  - Time of day
 

## Smart Waste Classification
- Predicts waste category using Machine Learning
- Suggests eco-friendly disposal methods
- Provides environmental impact details
- Autocomplete waste item suggestions


## Bioremediation Recommendation
- Suggests microorganisms and remediation techniques
- Estimates environmental recovery time
- Supports sustainable environmental treatment planning

## Dashboard & Analytics
- Waste collection analytics
- Recycling trends
- Environmental impact charts
- Visual insights using Chart.js

---


# Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/ShreyaaNChavan/EcoSmart-AI.git
cd EcoSmart-AI
```

---

## 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on:

```bash
http://127.0.0.1:5000
```

---

## 3️⃣ Frontend Setup

Open:

```bash
frontend/index.html
```

in browser.

---

#  API Endpoints

## Predict Waste

```http
POST /predict_waste
```

### Sample Request

```json
{
  "item": "plastic bottle"
}
```

---

## Predict Noise Risk

```http
POST /predict_noise
```

### Sample Request

```json
{
  "noise_db": 75,
  "traffic_density": 50,
  "area_type": "Commercial",
  "time_of_day": "Evening"
}
```

---

# Screenshots

## Homepage
<img width="1894" height="874" alt="image" src="https://github.com/user-attachments/assets/2527fd35-1de2-4031-be12-ee0a588ffd4f" />

---

## Noise Prediction
<img width="1871" height="862" alt="image" src="https://github.com/user-attachments/assets/427050a3-05c6-4af4-83b9-6587bca024ab" />


---

##  Waste Prediction
<img width="1832" height="863" alt="image" src="https://github.com/user-attachments/assets/dff55186-47ff-4112-99ec-094a6e121623" />
<br>
<img width="1130" height="784" alt="image" src="https://github.com/user-attachments/assets/3358a5b4-35c5-4480-b31c-283f3ee8ce9d" />

---

## Bioremediation
<img width="1920" height="861" alt="image" src="https://github.com/user-attachments/assets/85a9b6a6-1ae1-48b7-9a08-b18a4ac74494" />



##  Dashboard
<img width="1883" height="842" alt="image" src="https://github.com/user-attachments/assets/e1bf9450-a697-4290-82fd-325fa517f40c" />



---

#  Author

## Shreya N. Chavan

Artificial Intelligence & Data Science Student  


---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

---

#  License

This project is created for educational and research purposes.
