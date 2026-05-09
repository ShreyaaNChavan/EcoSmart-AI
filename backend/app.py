from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
import pickle


app = Flask(__name__)
CORS(app)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# -------------------------------
# PATHS
# -------------------------------
waste_model_path = os.path.join(BASE_DIR, "saved_models", "waste_model.pkl")
vectorizer_path = os.path.join(BASE_DIR, "saved_models", "vectorizer.pkl")
dataset_path = os.path.join(BASE_DIR, "data", "waste_cleaned_dataset.csv")

# -------------------------------
# LOAD MODELS
# -------------------------------
with open(waste_model_path, "rb") as f:
    waste_model = pickle.load(f)

with open(vectorizer_path, "rb") as f:
    vectorizer = pickle.load(f)

# -------------------------------
# LOAD DATASET
# -------------------------------
waste_df = pd.read_csv(dataset_path)

# -------------------------------
# DISPOSAL METHOD RANKING
# -------------------------------
method_scores = {
    "Compost": 17,
    "Vermicompost": 16,
    "Biogas": 15,
    "Recycle": 16,
    "Reuse": 15,
    "Animal feed": 15,
    "Return": 14,
    "Scrap": 13
}

def rank_methods(methods_str):
    methods = methods_str.split(";")
    ranked = []

    for m in methods:
        m = m.strip()
        score = method_scores.get(m, 10)

        ranked.append({
            "method": m,
            "score": score
        })

    ranked.sort(key=lambda x: x["score"], reverse=True)
    return ranked

# -------------------------------
# GET ALL ITEMS (for suggestions)
# -------------------------------
@app.route('/get_items', methods=['GET'])
def get_items():
    items = waste_df['item'].tolist()
    return jsonify(items)

# -------------------------------
# TRAIN MODEL (same as your code)
# -------------------------------
data = {
    'noise_db': [45, 60, 75, 85, 50, 65, 80],
    'traffic_density': [10, 30, 50, 70, 20, 40, 60],
    'area_type': ['Residential', 'Commercial', 'Industrial', 'Industrial', 'Residential', 'Commercial', 'Industrial'],
    'time_of_day': ['Morning', 'Afternoon', 'Evening', 'Night', 'Morning', 'Evening', 'Night'],
    'health_risk_score': [20, 45, 70, 90, 25, 55, 85]
}

df = pd.DataFrame(data)

# Encode categorical values
le_area = LabelEncoder()
le_time = LabelEncoder()

df['area_type'] = le_area.fit_transform(df['area_type'])
df['time_of_day'] = le_time.fit_transform(df['time_of_day'])

# Train model
X = df[['noise_db', 'traffic_density', 'area_type', 'time_of_day']]
y = df['health_risk_score']

model = LinearRegression()
model.fit(X, y)


@app.route('/')
def home():
    return "EcoSmart AI Backend Running"

# -------------------------------
# WASTE PREDICTION API
# -------------------------------
@app.route('/predict_waste', methods=['POST'])
def predict_waste():
    data = request.json
    user_input = data.get("item", "").lower()

    if user_input == "":
        return jsonify({"error": "No item provided"}), 400

    try:
        # Convert input to vector
        input_vec = vectorizer.transform([user_input])

        # Predict closest item
        predicted_item = waste_model.predict(input_vec)[0]

        # Fetch details from dataset
        result = waste_df[waste_df['item'] == predicted_item].iloc[0]

        # Rank disposal methods
        recommendations = rank_methods(result['disposal_methods'])

        return jsonify({
            "input": user_input,
            "matched_item": predicted_item,
            "category": result['category'],
            "description": result['description'],
            "impact": result['impact'],
            "recommendations": recommendations
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# API ROUTE
# -------------------------------
@app.route('/predict_noise', methods=['POST'])

def predict_noise():
    data = request.json

    noise_db = float(data['noise_db'])
    traffic = float(data['traffic_density'])
    area = data['area_type']
    time = data['time_of_day']

    # Encode input
    area_encoded = le_area.transform([area])[0]
    time_encoded = le_time.transform([time])[0]

    # Prediction
    input_data = np.array([[noise_db, traffic, area_encoded, time_encoded]])
    prediction = model.predict(input_data)[0]

    # Level classification
    if prediction < 40:
        level = "Low"
    elif prediction < 70:
        level = "Medium"
    else:
        level = "High"

    return jsonify({
        "score": round(prediction, 2),
        "level": level
    })





# -------------------------------
# RUN SERVER
# -------------------------------
if __name__ == '__main__':
    app.run(debug=True)